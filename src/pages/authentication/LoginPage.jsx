import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Field, Input, Label } from "@/ui";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // refresh bo'lib ketmasligi uchun
    setError("");

    if (!phone.trim()) {
      setError("Iltimos, telefon raqamingizni kiriting.");
      return;
    }

    if (!password.trim()) {
      setError("Iltimos, parolingizni kiriting.");
      return;
    }

    console.log("Login yuborilmoqda:", { phone, password });
  };

  return (
    <section className="w-full h-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Tizimga kirish
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 font-normal">
          Avtorizatsiyadan o'tish uchun ma'lumotlaringizni kiriting
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4 border-none">
        <Field>
          <Label htmlFor="phone" className="font-medium text-sm">
            Telefon raqamingizni kiriting.
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError("");
            }}
            placeholder="+998 90 123 45 67"
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-medium text-sm">
              Parol
            </Label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#2563EB] hover:underline font-medium"
            >
              Parolni unutdingizmi?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="Parolingizni kiriting"
          />
        </Field>

        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-10 font-medium text-white bg-[#2563EB] hover:bg-blue-700"
        >
          Tizimga kirish
        </Button>
      </form>
    </section>
  );
}

export default LoginPage;