<script>
  import { page } from '$app/stores';

  $: formResult = $page.form;
  $: errorMessage = formResult?.error;
  $: emailValue = formResult?.email || '';
</script>

<div class="sign-in__fullscreen">
  <div class="sign-in__container">
    <form class="sign-in__form" method="POST">
      <h2 class="sign-in__title">Sign In</h2>
      {#if errorMessage}
        <div class="sign-in__error">
          {errorMessage} 
          {#if emailValue }
            <span>for {emailValue}</span>
          {/if}
        </div>
      {/if}
      <div class="sign-in__field">
        <label for="email" class="sign-in__label">email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          class="sign-in__input"
        />
      </div>
      <div class="sign-in__field">
        <label for="password" class="sign-in__label">password</label>
        <input
          class="sign-in__input"
          type="password"
          id="password"
          name="password"
          placeholder="password"
        />
      </div>
      <div class="sign-in__actions">
        <button type="submit" class="sign-in__button">Submit</button>
      </div>
      <div class="sign-in__link-container">
        <a href="/sign-up" class="sign-in__link">Create Account</a>
      </div>
    </form>
  </div>
</div>

<style lang="postcss">
  .sign-in__fullscreen {
    position: fixed;
    top: 64px;
    width: 100%;
    height: 100vh;
    background: #447799;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign-in__container {
    width: 100%;
    max-width: 400px;
    padding: 0 20px;
  }

  .sign-in__form {
    background: white;
    padding: 32px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .sign-in__title {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 700;
    font-size: 24px;
    text-align: center;
    margin: 0 0 24px 0;
    color: #333;
  }

  .sign-in__error {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    border-radius: 2px;
    font-size: 14px;
  }

  .sign-in__field {
    margin-bottom: 16px;
  }

  .sign-in__label {
    display: block;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    margin-left: 2px;
  }

  .sign-in__input {
    width: 100%;
    padding: 8px;
    border: 1px solid #333;
    border-radius: 2px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 14px;
    box-sizing: border-box;
  }

  .sign-in__input:focus {
    outline: none;
    border-color: #447799;
    box-shadow: 0 0 0 2px rgba(68, 119, 153, 0.2);
  }

  .sign-in__actions {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .sign-in__button {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    padding: 6px 12px;
    border: 1px solid black;
    border-radius: 2px;
    background-color: tan;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .sign-in__button:hover {
    background-color: #d2b48c;
  }

  .sign-in__link-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .sign-in__link {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 14px;
    color: #447799;
    text-decoration: none;
  }

  .sign-in__link:hover {
    text-decoration: underline;
  }
</style>
