import { Link } from "react-router-dom";
import { Button, Field, Input, Label } from "@/ui";

function LoginPage() {
  const handleSubmit = (e) => {
    e.target.value;
  };

  return (
    <section className="w-full h-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Tizimga kirish
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
        </p>  
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-none">
        <Field>
          <Label htmlFor="phone">Telefon raqamingizni kiriting</Label>
          <Input id="phone" type="tel" placeholder="Telefon raqam kiriting." />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Parol</Label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Parolni unutdingizmi?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="Parolingizni kiriting" />
        </Field>

        <Button type="submit" className="w-full h-10 font-medium text-white bg-[#2563EB]">
          Tizimga kirish
        </Button>
      </form>
    </section>
  );
}

export default LoginPage;