import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "glass shadow-elegant",
          }
        }}
      />
    </div>
  )
}