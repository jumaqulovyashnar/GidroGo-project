import { Link } from "react-router-dom"
import { Button, Field, Input, Label } from "@/ui"

function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Parolni tiklash
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          Telefon raqamingizni kiriting, tasdiqlash kodini yuboramiz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <Label htmlFor="phone">Telefon raqam</Label>
          <Input id="phone" type="tel" placeholder="+998 90 123 45 67" />
        </Field>

        <Button type="submit" className="w-full mt-2">
          Kodni yuborish
        </Button>

        <div className="text-center text-sm text-muted-foreground pt-2">
          <Link to="/login" className="text-primary font-medium hover:underline">
            ← Kirish sahifasiga qaytish
          </Link>
        </div>
      </form>
    </section>
  )
}

export default ForgotPasswordPage
