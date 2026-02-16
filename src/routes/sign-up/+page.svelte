<script>
  import { page } from '$app/stores';

  $: formResult = $page.form;
  $: errorMessage = formResult?.error;
</script>

<div class="sign-up__fullscreen">
  <div class="sign-up__container">
    <form class="sign-up__form" method="POST">
      <h2 class="sign-up__title">Sign Up</h2>
      {#if errorMessage}
        <div class="sign-up__error">
          {errorMessage} 
        </div>
      {/if}
      <div class="sign-up__field">
        <label for="username" class="sign-up__label">username</label>
        <input
          type="username"
          id="username"
          name="username"
          placeholder="select a unique username"
          class="sign-up__input"
        />
      </div>
      <div class="sign-up__field">
        <label for="email" class="sign-up__label">email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          class="sign-up__input"
        />
      </div>
      <div class="sign-up__field">
        <label for="password" class="sign-up__label">password</label>
        <input
          class="sign-up__input"
          type="password"
          id="password"
          name="password"
          placeholder="password"
        />
      </div>
      <div class="sign-up__actions">
        <button type="submit" class="sign-up__button">Submit</button>
      </div>
      <div class="sign-up__link-container">
        <a href="/sign-in" class="sign-up__link">Sign In</a>
      </div>
    </form>
  </div>
</div>

<style lang="postcss">
  .sign-up__fullscreen {
    position: fixed;
    top: 64px;
    width: 100%;
    height: 100vh;
    background: #447799;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign-up__container {
    width: 100%;
    max-width: 400px;
    padding: 0 20px;
  }

  .sign-up__form {
    background: white;
    padding: 32px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .sign-up__title {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 700;
    font-size: 24px;
    text-align: center;
    margin: 0 0 24px 0;
    color: #333;
  }

  .sign-up__error {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    border-radius: 2px;
    font-size: 14px;
  }

  .sign-up__field {
    margin-bottom: 16px;
  }

  .sign-up__label {
    display: block;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    margin-left: 2px;
  }

  .sign-up__input {
    width: 100%;
    padding: 8px;
    border: 1px solid #333;
    border-radius: 2px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 14px;
    box-sizing: border-box;
  }

  .sign-up__input:focus {
    outline: none;
    border-color: #447799;
    box-shadow: 0 0 0 2px rgba(68, 119, 153, 0.2);
  }

  .sign-up__actions {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .sign-up__button {
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

  .sign-up__button:hover {
    background-color: #d2b48c;
  }

  .sign-up__link-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .sign-up__link {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 14px;
    color: #447799;
    text-decoration: none;
  }

  .sign-up__link:hover {
    text-decoration: underline;
  }
</style>