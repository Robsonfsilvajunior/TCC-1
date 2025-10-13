import { useContext } from "react";
import logoImg from "../../assets/easysisLogo.png";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../components/container";
import { Input } from "../../components/input";


import { AuthContext } from "../../contexts/authContext";
import { authService } from "../../services/mongodbConnection";

import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório."),
  email: z
    .string()
    .email("Por favor, insira um e-mail válido.")
    .nonempty("O campo de e-mail é obrigatório."),
  password: z
    .string()
    .min(6, "A senha deve conter pelo menos 6 caracteres.")
    .nonempty("O campo de senha é obrigatório."),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });



  async function onSubmit(data: FormData) {
    try {
      // Chamar API de registro
      const userData = await authService.register(data.name, data.email, data.password);
      
      // Salvar dados do usuário no contexto
      handleInfoUser({
        uid: userData.uid,
        name: userData.name,
        email: userData.email
      });
      
      console.log("CADASTRADO COM SUCESSO!");
      toast.success(`Cadastro realizado!\nBem-vindo(a), ${data.name}!`, {
        style: {
          fontSize: "14px",
        },
      });
      
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário';
      toast.error(errorMessage);
      console.error('Erro no registro:', error);
    }
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img
            src={logoImg}
            alt="Logo Easysis"
            className="w-48 h-auto mx-auto"
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3 text-center">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-mainRed hover:bg-mainRedLighter w-full rounded-md text-white h-10 font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-linear"
          >
            Cadastrar <BsFillPersonPlusFill size={24} color="#FFF" />
          </button>
        </form>

        <Link
          to="/login"
          className="hover:underline transition-all duration-200 ease-linear text-center"
        >
          Já possui uma conta? Faça o login!
        </Link>
      </div>
    </Container>
  );
}
