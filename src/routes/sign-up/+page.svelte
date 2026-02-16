<script>
  import { page } from '$app/stores';

  $: formResult = $page.form;
  $: errorMessage = formResult?.error;
</script>

<main class="w-full h-screen flex items-center justify-center bg-neutral-100">
  <form class="shadow-md rounded-sm w-[400px] p-8" method="POST">
    <h2 class="text-center text-2xl text-neutral-950 mb-8">Sign Up</h2>
    <div class="mb-2">
      <label for="username" class="block font-light text-neutral-800 ml-2"
        >username</label
      >
      {#if errorMessage}
        <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage} 
        </div>
      {/if}
      <input
        type="username"
        id="username"
        name="username"
        placeholder="select a unique username"
        class="w-full p-2 border border-neutral-800 rounded-lg"
      />
    </div>
    <div class="mb-2">
      <label for="email" class="block font-light text-neutral-800 ml-2"
        >email</label
      >
      <input
        type="email"
        id="email"
        name="email"
        placeholder="email"
        class="w-full p-2 border border-neutral-800 rounded-lg"
      />
    </div>
    <div class="mb-6">
      <label for="password" class="block font-light text-neutral-800 ml-2"
        >password</label
      >
      <input
        class="w-full p-2 border border-neutral-800 rounded-lg"
        type="password"
        id="password"
        name="password"
        placeholder="password"
      />
    </div>
    <div class="w-full flex justify-center">
      <button
        type="submit"
        class="bg-orange-600 hover:bg-orange-500 text-lg text-white rounded-full py-2 px-4"
        >Submit</button
      >
    </div>
    <div class="w-full flex justify-center mt-8">
      <a href="/sign-in">Sign In</a>
    </div>
  </form>
</main>