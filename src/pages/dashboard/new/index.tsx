import { ChangeEvent, useState, useContext, useEffect } from "react";
import { Container } from "../../../components/container";

import { FiUpload, FiTrash } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";
import { GiCarKey } from "react-icons/gi";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext } from "../../../contexts/authContext";
import { v4 as uuidV4 } from "uuid";
import { storage } from "../../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// import { vehicleService } from "../../../services/mongodbConnection";
import { toast } from "react-hot-toast";

const schema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  model: z
    .string()
    .min(1, "Campo obrigatório")
    .max(30, "Máximo de 30 caracteres"),
  year: z
    .string()
    .min(4, "Campo obrigatório")
    .refine(
      (value) => {
        // Aceita um valor com 4 dígitos ou um valor com 4 dígitos, uma barra e mais 4 dígitos (XXXX/XXXX)
        return /^\d{4}$|^\d{4}\/\d{4}$/.test(value);
      },
      {
        message: "Ano inválido",
      }
    ),
  km: z
    .string()
    .refine((value) => /^\d+$/.test(value), {
      message: "Apenas números são permitidos",
    })
    .refine((value) => value !== "", {
      message: "Campo obrigatório",
    }),
  price: z
    .string()
    .refine((value) => /^\d+$/.test(value), {
      message: "Apenas números são permitidos",
    })
    .refine((value) => value !== "", {
      message: "Campo obrigatório",
    }),
  city: z.string().nonempty("Campo obrigatório"),
  state: z.string().nonempty("Campo obrigatório"),
  whatsapp: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero inválido",
    }),
  description: z.string().nonempty("Campo obrigatório"),
  gas: z.string().nonempty("Campo obrigatório"),
  color: z.string().nonempty("Campo obrigatório"),
  body: z.string().nonempty("Campo obrigatório"),
  plateEnd: z.string().nonempty("Campo obrigatório"),
  transmission: z.string().nonempty("Campo obrigatório"),
  ipva: z.string().nonempty("Campo obrigatório"),
  owner: z.string().nonempty("Campo obrigatório"),
  trade: z.string().nonempty("Campo obrigatório"),
  license: z.string().nonempty("Campo obrigatório"),
  armored: z.string().nonempty("Campo obrigatório"),
  inspections: z.string().nonempty("Campo obrigatório"),
  version: z
    .string()
    .min(1, "Campo obrigatório")
    .max(40, "Máximo de 40 caracteres"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  name: string;
  uid: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  const greetings = {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
  };

  function getGreeting(hour: number) {
    if (hour >= 5 && hour < 12) {
      return greetings.morning;
    } else if (hour >= 12 && hour < 18) {
      return greetings.afternoon;
    } else {
      return greetings.evening;
    }
  }

  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentGreeting = getGreeting(currentHour);
    setGreeting(currentGreeting);
  }, []);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        toast.error("Por favor, selecione uma imagem em formato JPEG ou PNG.");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downLoadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downLoadUrl,
        };

        setCarImages((images) => [...images, imageItem]);
        toast.success("Imagem adicionada com sucesso!");
      });
    });
  }

  async function onSubmit(data: FormData) {
    if (carImages.length === 0) {
      toast.error("Por favor, envie pelo menos uma imagem.");
      return;
    }

    // Temporariamente desabilitado para teste
    toast("Funcionalidade temporariamente desabilitada para teste");
    console.log("Dados do veículo:", data);
    console.log("Imagens:", carImages);
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages((prevCarImages) =>
        prevCarImages.filter((car: ImageItemProps) => car.url !== item.url)
      );
      toast.success("Imagem removida com sucesso!", {
        icon: "🗑️",
      });
    } catch (err) {
      toast.error("Erro ao deletar imagem!");
    }
  }

  return (
    <Container>
      <header className="w-full max-w-3xl mx-auto text-center mb-4">
        <h1 className="text-white font-bold text-4xl mb-2">
          {greeting}, {user?.name || "Visitante"}!
        </h1>
        <p className="text-white font-medium mt-6">
          Preencha as informações do seu veículo para cadastrá-lo na plataforma
        </p>
      </header>

      <form className="w-full max-w-2xl mx-auto space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-white font-bold mt-2">Fotos do veículo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full p-2 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            register={register}
            name="name"
            error={errors.name?.message}
            placeholder="Nome do veículo"
            type="text"
          />

          <Input
            register={register}
            name="model"
            error={errors.model?.message}
            placeholder="Modelo"
            type="text"
          />

          <Input
            register={register}
            name="year"
            error={errors.year?.message}
            placeholder="Ano"
            type="text"
          />

          <Input
            register={register}
            name="km"
            error={errors.km?.message}
            placeholder="Quilometragem"
            type="text"
          />

          <Input
            register={register}
            name="price"
            error={errors.price?.message}
            placeholder="Preço"
            type="text"
          />

          <Input
            register={register}
            name="city"
            error={errors.city?.message}
            placeholder="Cidade"
            type="text"
          />

          <Input
            register={register}
            name="state"
            error={errors.state?.message}
            placeholder="Estado"
            type="text"
          />

          <Input
            register={register}
            name="whatsapp"
            error={errors.whatsapp?.message}
            placeholder="WhatsApp"
            type="text"
          />

          <Input
            register={register}
            name="description"
            error={errors.description?.message}
            placeholder="Descrição"
            type="text"
          />

          <Input
            register={register}
            name="gas"
            error={errors.gas?.message}
            placeholder="Tipo de combustível"
            type="text"
          />

          <Input
            register={register}
            name="color"
            error={errors.color?.message}
            placeholder="Cor"
            type="text"
          />

          <Input
            register={register}
            name="body"
            error={errors.body?.message}
            placeholder="Tipo de carroceria"
            type="text"
          />

          <Input
            register={register}
            name="plateEnd"
            error={errors.plateEnd?.message}
            placeholder="Final da placa"
            type="text"
          />

          <Input
            register={register}
            name="transmission"
            error={errors.transmission?.message}
            placeholder="Transmissão"
            type="text"
          />

          <Input
            register={register}
            name="ipva"
            error={errors.ipva?.message}
            placeholder="IPVA"
            type="text"
          />

          <Input
            register={register}
            name="owner"
            error={errors.owner?.message}
            placeholder="Proprietário"
            type="text"
          />

          <Input
            register={register}
            name="trade"
            error={errors.trade?.message}
            placeholder="Aceita troca"
            type="text"
          />

          <Input
            register={register}
            name="license"
            error={errors.license?.message}
            placeholder="Licenciamento"
            type="text"
          />

          <Input
            register={register}
            name="armored"
            error={errors.armored?.message}
            placeholder="Blindado"
            type="text"
          />

          <Input
            register={register}
            name="inspections"
            error={errors.inspections?.message}
            placeholder="Inspeções"
            type="text"
          />

          <Input
            register={register}
            name="version"
            error={errors.version?.message}
            placeholder="Versão"
            type="text"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cadastrar veículo
        </button>
      </form>

      <div className="w-full max-w-2xl mx-auto mt-4">
        <h2 className="text-white font-bold mb-2">Imagens carregadas:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {carImages.map((item) => (
            <div key={item.name} className="relative">
              <img
                src={item.previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(item)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <FiTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
