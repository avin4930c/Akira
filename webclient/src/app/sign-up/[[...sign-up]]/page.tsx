import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <SignUp 
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