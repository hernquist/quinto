interface DropzoneOptions {
	dropEffect?: 'move' | 'copy' | 'link' | 'none';
	dragover_class?: string;
	on_dropzone: (data: string | number, event: Event) => void;
}

interface TouchDragDetail {
	data: string | number;
	clientX: number;
	clientY: number;
}

export function draggable(node: HTMLElement, data: string | number) {
	let state = data;
	let touchStartX = 0;
	let touchStartY = 0;
	let isDragging = false;
	let dragElement: HTMLElement | null = null;
	let dragOffset = { x: 0, y: 0 };
	let lastHoveredElement: Element | null = null;

	// Desktop drag and drop
	node.draggable = true;
	node.style.cursor = 'grab';
	node.style.touchAction = 'none'; // Prevent default touch behaviors

	function handle_dragstart(e: DragEvent) {
		if (!e.dataTransfer) return;
		e.dataTransfer.setData('text/plain', String(state));
		e.dataTransfer.effectAllowed = 'move';
	}

	// Mobile touch handlers
	function handle_touchstart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		
		const touch = e.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		isDragging = false;

		// Create a clone for visual feedback
		dragElement = node.cloneNode(true) as HTMLElement;
		dragElement.style.position = 'fixed';
		dragElement.style.top = '-1000px';
		dragElement.style.opacity = '0.8';
		dragElement.style.pointerEvents = 'none';
		dragElement.style.zIndex = '10000';
		dragElement.style.transform = 'scale(1.1)';
		document.body.appendChild(dragElement);

		// Store original position
		const rect = node.getBoundingClientRect();
		dragOffset.x = touch.clientX - rect.left - rect.width / 2;
		dragOffset.y = touch.clientY - rect.top - rect.height / 2;

		// Add dragging class to original element
		node.style.opacity = '0.5';
	}

	function handle_touchmove(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		
		const touch = e.touches[0];
		const deltaX = Math.abs(touch.clientX - touchStartX);
		const deltaY = Math.abs(touch.clientY - touchStartY);

		// Start dragging after a small threshold to avoid accidental drags
		if (!isDragging && (deltaX > 5 || deltaY > 5)) {
			isDragging = true;
			e.preventDefault(); // Prevent scrolling
		}

		if (isDragging && dragElement) {
			// Update clone position
			dragElement.style.left = (touch.clientX - dragOffset.x) + 'px';
			dragElement.style.top = (touch.clientY - dragOffset.y) + 'px';

			// Find element under touch point
			const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
			
			// Dispatch leave event if we moved away from the last element
			if (lastHoveredElement && lastHoveredElement !== elementBelow) {
				const leaveEvent = new CustomEvent('touchdragleave', {
					bubbles: true,
					cancelable: true
				});
				lastHoveredElement.dispatchEvent(leaveEvent);
			}
			
			if (elementBelow) {
				// Dispatch custom event to dropzones
				const dragOverEvent = new CustomEvent<TouchDragDetail>('touchdragover', {
					bubbles: true,
					cancelable: true,
					detail: { data: state, clientX: touch.clientX, clientY: touch.clientY }
				});
				elementBelow.dispatchEvent(dragOverEvent);
				lastHoveredElement = elementBelow;
			} else {
				lastHoveredElement = null;
			}
		}
	}

	function handle_touchend(e: TouchEvent) {
		if (!isDragging) {
			// Clean up if we didn't drag
			if (dragElement) {
				document.body.removeChild(dragElement);
				dragElement = null;
			}
			node.style.opacity = '';
			return;
		}

		if (e.changedTouches.length !== 1) {
			cleanup();
			return;
		}

		const touch = e.changedTouches[0];
		const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
		
		if (elementBelow) {
			// Dispatch drop event
			const dropEvent = new CustomEvent<TouchDragDetail>('touchdrop', {
				bubbles: true,
				cancelable: true,
				detail: { data: state, clientX: touch.clientX, clientY: touch.clientY }
			});
			elementBelow.dispatchEvent(dropEvent);
		}

		cleanup();
	}

	function handle_touchcancel() {
		cleanup();
	}

	function cleanup() {
		// Dispatch leave event to last hovered element
		if (lastHoveredElement) {
			const leaveEvent = new CustomEvent('touchdragleave', {
				bubbles: true,
				cancelable: true
			});
			lastHoveredElement.dispatchEvent(leaveEvent);
			lastHoveredElement = null;
		}
		
		if (dragElement) {
			document.body.removeChild(dragElement);
			dragElement = null;
		}
		node.style.opacity = '';
		isDragging = false;
	}

	// Desktop events
	node.addEventListener('dragstart', handle_dragstart);
	
	// Mobile touch events
	node.addEventListener('touchstart', handle_touchstart, { passive: false });
	node.addEventListener('touchmove', handle_touchmove, { passive: false });
	node.addEventListener('touchend', handle_touchend);
	node.addEventListener('touchcancel', handle_touchcancel);

	return {
		update(data: string | number) {
			state = data;
		},

		destroy() {
			node.removeEventListener('dragstart', handle_dragstart);
			node.removeEventListener('touchstart', handle_touchstart);
			node.removeEventListener('touchmove', handle_touchmove);
			node.removeEventListener('touchend', handle_touchend);
			node.removeEventListener('touchcancel', handle_touchcancel);
			cleanup();
		}
	};
}

export function dropzone(node: HTMLElement, options: DropzoneOptions) {
	let state: DropzoneOptions = {
		dropEffect: 'move',
		dragover_class: 'droppable',
		...options
	};

	// Desktop drag and drop handlers
	function handle_dragenter(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.add(state.dragover_class || 'droppable');
	}

	function handle_dragleave(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class || 'droppable');
	}

	function handle_dragover(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = state.dropEffect || 'move';
	}

	function handle_drop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const data = e.dataTransfer.getData('text/plain');
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class || 'droppable');
		state.on_dropzone(data, e);
	}

	// Mobile touch handlers
	function handle_touchdragover(e: Event) {
		const customEvent = e as CustomEvent<TouchDragDetail>;
		if (!customEvent.detail) return;
		
		// Check if the touch point is within this dropzone
		const rect = node.getBoundingClientRect();
		const detail = customEvent.detail;
		if (detail.clientX >= rect.left && 
			detail.clientX <= rect.right &&
			detail.clientY >= rect.top && 
			detail.clientY <= rect.bottom) {
			node.classList.add(state.dragover_class || 'droppable');
		} else {
			node.classList.remove(state.dragover_class || 'droppable');
		}
	}

	function handle_touchdrop(e: Event) {
		const customEvent = e as CustomEvent<TouchDragDetail>;
		const detail = customEvent.detail;
		if (!detail || detail.data === undefined) return;
		
		// Check if the touch point is within this dropzone
		const rect = node.getBoundingClientRect();
		if (detail.clientX >= rect.left && 
			detail.clientX <= rect.right &&
			detail.clientY >= rect.top && 
			detail.clientY <= rect.bottom) {
			node.classList.remove(state.dragover_class || 'droppable');
			state.on_dropzone(detail.data, e);
		}
	}

	function handle_touchdragleave() {
		node.classList.remove(state.dragover_class || 'droppable');
	}

	// Desktop events
	node.addEventListener('dragenter', handle_dragenter);
	node.addEventListener('dragleave', handle_dragleave);
	node.addEventListener('dragover', handle_dragover);
	node.addEventListener('drop', handle_drop);

	// Mobile touch events
	node.addEventListener('touchdragover', handle_touchdragover);
	node.addEventListener('touchdrop', handle_touchdrop);
	node.addEventListener('touchdragleave', handle_touchdragleave);

	return {
		update(options: DropzoneOptions) {
			state = {
				dropEffect: 'move',
				dragover_class: 'droppable',
				...options
			};
		},

		destroy() {
			node.removeEventListener('dragenter', handle_dragenter);
			node.removeEventListener('dragleave', handle_dragleave);
			node.removeEventListener('dragover', handle_dragover);
			node.removeEventListener('drop', handle_drop);
			node.removeEventListener('touchdragover', handle_touchdragover);
			node.removeEventListener('touchdrop', handle_touchdrop);
			node.removeEventListener('touchdragleave', handle_touchdragleave);
		}
	};
}

