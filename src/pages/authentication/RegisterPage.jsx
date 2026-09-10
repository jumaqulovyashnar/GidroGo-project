import { Link } from "react-router-dom"
import { Button, Field, Input, Label } from "@/ui"

function RegisterPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Roʻyxatdan oʻtish
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          Yangi hisob yaratish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <Label htmlFor="fullname">Toʻliq ismingiz</Label>
          <Input id="fullname" placeholder="Ali Valiyev" />
        </Field>

        <Field>
          <Label htmlFor="phone">Telefon raqam</Label>
          <Input id="phone" type="tel" placeholder="+998 90 123 45 67" />
        </Field>

        <Field>
          <Label htmlFor="password">Parol</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </Field>

        <Button type="submit" className="w-full mt-2">
          Roʻyxatdan oʻtish
        </Button>

        <div className="text-center text-sm text-muted-foreground pt-2">
          Akkauntingiz bormi?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Kirish
          </Link>
        </div>
      </form>
    </section>
  )
}

export default RegisterPage
