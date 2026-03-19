import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ShieldAlert, UserPlus } from "lucide-react";
import BlurText from "@/components/BlurText";
import { useForm } from "react-hook-form";
import type { SignUpInterface } from "@/auth/interfaces/SignUp.interface";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useCreateUserAndSessionMutate } from "@/auth/stack/LoginStack";
import { LoginSocial } from "@/auth/components/LoginSocial";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState: { errors }, handleSubmit, getValues } = useForm<SignUpInterface>()
  const { mutate, isPending } = useCreateUserAndSessionMutate()
  const onSubmit = (dataForm: SignUpInterface) => {
    console.log('completado')
    mutate(dataForm)
  }

  return (
    <Card className="border-2 shadow-none lg:shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold tracking-tight">
          <BlurText
            text="Crear Cuenta"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-2xl"
          />
        </CardTitle>
        <CardDescription>Completa tus datos para registrarte</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Label htmlFor="name">Nombre</Label>
                {
                  errors.name && (
                    <CustomTooltip description={errors.name.message!} >
                      <ShieldAlert color="red" size={20} />
                    </CustomTooltip>
                  )
                }
              </div>
              <Input
                {...register('name', {
                  required: {
                    value: true,
                    message: 'Es requerido'
                  },
                  validate: (value: string) => !value.includes(' ') || 'No puede contener espacios en blanco'
                })}
                id="name"
                type="text"
                placeholder="Juan"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                {
                  errors.lastName && (
                    <CustomTooltip description={errors.lastName.message!} >
                      <ShieldAlert color="red" size={20} />
                    </CustomTooltip>
                  )
                }
              </div>
              <Input
                {...register('lastName', {
                  required: {
                    value: true,
                    message: 'Es requerido'
                  },
                  validate: (value: string) => !value.includes(' ') || 'No puede contener espacios en blanco'
                })}
                id="lastName"
                type="text"
                placeholder="Pérez"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              {
                errors.email && (
                  <CustomTooltip description={errors.email.message!} >
                    <ShieldAlert color="red" size={20} />
                  </CustomTooltip>
                )
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
                  message: 'Correo invalido'
                }
              })}
              id="email"
              type="text"
              placeholder="tu@email.com"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
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
            <div className="relative">
              <Input
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Es requerido'
                  },
                  minLength: {
                    value: 6,
                    message: 'Minimo tiene que tener 6 caracteres'
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              {
                errors.confirmPassword && (
                  <CustomTooltip description={errors.confirmPassword.message!} >
                    <ShieldAlert color="red" size={20} />
                  </CustomTooltip>
                )
              }
            </div>
            <Input
              {...register('confirmPassword', {
                validate: (value: string) => value === getValues('password') || 'Las contraseñas deben coincidir'
              })}
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 my-5">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Registrando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Registrarse
              </span>
            )}
          </Button>

          <LoginSocial />

          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterPage;