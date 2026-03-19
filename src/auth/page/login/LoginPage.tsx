import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, ShieldAlert } from "lucide-react";
import BlurText from "@/components/BlurText";
import { useForm } from 'react-hook-form'
import { CustomTooltip } from "@/components/CustomTooltip";
import { useSignInWithPasswordMutate } from "@/auth/stack/LoginStack";
import { LoginSocial } from "@/auth/components/LoginSocial";

interface Inputs {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register, formState: { errors }, handleSubmit } = useForm<Inputs>()
  const { mutate: mutateLogin, isPending: isPendingLogin } = useSignInWithPasswordMutate()
  const onSubmit = (data: Inputs) => {
    mutateLogin(data)
  };

  return (
    <>
      <Card className="border-2 shadow-none lg:shadow-sm">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold tracking-tight">
            <BlurText
              text="Iniciar Sesión"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-2xl"
            />
          </CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                {
                  errors.email && <span className="text-xs text-red-500">*{errors.email.message}</span>
                }

              </div>
              <Input
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Es requerido'
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'No sigue el formato de correo'
                  }
                })}
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  {
                    errors.password && (
                      <CustomTooltip description={errors.password.message!} >
                        <ShieldAlert color="red" size={20} />
                      </CustomTooltip>
                    )
                  }
                </div>
              </div>
              <div className="relative">
                <Input
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Es requerido'
                    },
                    minLength: {
                      value: 6,
                      message: 'Como minimo tiene que tener 6 caracteres'
                    }
                  })}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 my-5">
            <Button type="submit" className="w-full" disabled={isPendingLogin}>
              {isPendingLogin ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </span>
              )}
            </Button>

            <LoginSocial />
            <p className="text-sm text-muted-foreground text-center">
              ¿No tienes cuenta?{" "}
              <Link to="/auth/register" className="text-primary font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default LoginPage;