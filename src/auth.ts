import { SvelteKitAuth } from "@auth/sveltekit"
import NeonAdapter from "@auth/neon-adapter"
import GitHub from "@auth/sveltekit/providers/github"
import { Pool } from "@neondatabase/serverless"
import Resend from "@auth/core/providers/resend"
import { DATABASE_URL, AUTH_RESEND_KEY, EMAIL_SERVER, EMAIL_FROM } from "$env/static/private"
 
// *DO NOT* create a `Pool` here, outside the request handler.
 
export const { handle, signIn, signOut } = SvelteKitAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: DATABASE_URL })
  return {
    // or do I use PostgresAdapter(pool)?
    adapter: NeonAdapter(pool),
    providers: [Resend({ 
        apiKey: AUTH_RESEND_KEY,
        from: 'Test <onboarding@resend.dev>',
        
    })],
  }
})