import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { AuthContext } from "../../../contexts/authContext";
import { vehicleService } from "../../../services/mongodbConnection";

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
  id?: string;
}

export function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicle() {
      if (!id) {
        toast.error("ID do veículo não fornecido");
        navigate("/dashboard");
        return;
      }

      try {
        const vehicle = await vehicleService.getVehicleById(id);
        
        // Verificar se o usuário é o proprietário
        if (vehicle.uid !== user?.uid) {
          toast.error("Você não tem permissão para editar este veículo!");
          navigate("/dashboard");
          return;
        }

        // Preencher o formulário com os dados existentes
        setValue("name", vehicle.name);
        setValue("model", vehicle.model);
        setValue("year", vehicle.year);
        setValue("km", vehicle.km);
        setValue("price", vehicle.price);
        setValue("city", vehicle.city);
        setValue("state", vehicle.state);
        setValue("whatsapp", vehicle.whatsapp);
        setValue("description", vehicle.description);
        setValue("gas", vehicle.gas);
        setValue("color", vehicle.color);
        setValue("body", vehicle.body);
        setValue("plateEnd", vehicle.plateEnd);
        setValue("transmission", vehicle.transmission);
        setValue("ipva", vehicle.ipva);
        setValue("owner", vehicle.owner);
        setValue("trade", vehicle.trade);
        setValue("license", vehicle.license);
        setValue("armored", vehicle.armored);
        setValue("inspections", vehicle.inspections);
        setValue("version", vehicle.version);

        // Armazenar imagens existentes
        if (vehicle.images && Array.isArray(vehicle.images)) {
          setExistingImages(vehicle.images);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar veículo:", error);
        toast.error("Erro ao carregar dados do veículo!");
        navigate("/dashboard");
      }
    }

    loadVehicle();
  }, [id, user, navigate, setValue]);

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

    try {
      const result = await vehicleService.uploadImages([image]);
      
      if (result.images && result.images.length > 0) {
        const uploadedImage = result.images[0];
        
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: uploadedImage.id,
          id: uploadedImage.id
        };

        setCarImages((images) => [...images, imageItem]);
        toast.success("Imagem adicionada com sucesso!");
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error("Erro ao fazer upload da imagem!");
    }
  }

  async function onSubmit(data: FormData) {
    if (existingImages.length === 0 && carImages.length === 0) {
      toast.error("Por favor, envie pelo menos uma imagem.");
      return;
    }

    try {
      // Combinar imagens existentes com novas imagens
      const newImageIds = carImages.map(img => img.id).filter(Boolean);
      const allImages = [...existingImages, ...newImageIds];
      
      const payload = { 
        ...data, 
        images: allImages,
        uid: user?.uid // Manter o uid do proprietário
      };
      
      await vehicleService.updateVehicle(id!, payload);
      toast.success('Veículo atualizado com sucesso!');
      navigate("/dashboard");
    } catch (err) {
      toast.error('Erro ao atualizar veículo!');
      console.error("Erro ao atualizar:", err);
    }
  }

  async function handleDeleteImage(item: ImageItemProps) {
    setCarImages((prevCarImages) =>
      prevCarImages.filter((car: ImageItemProps) => car.url !== item.url)
    );
    toast.success("Imagem removida com sucesso!");
  }

  function handleDeleteExistingImage(imageUrl: string) {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
    toast.success("Imagem removida com sucesso!");
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white">Carregando...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <header className="w-full max-w-3xl mx-auto text-center mb-4">
        <h1 className="text-black font-bold text-4xl mb-2">
          Editar Veículo
        </h1>
        <p className="text-black font-medium mt-6">
          Atualize as informações do seu veículo
        </p>
      </header>

      <form className="w-full max-w-2xl mx-auto space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-black font-bold mt-2">Adicionar novas fotos:</label>
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
          Atualizar veículo
        </button>
      </form>

      <div className="w-full max-w-2xl mx-auto mt-4">
        <h2 className="text-black font-bold mb-2">Imagens atuais:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {existingImages.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt="Existing"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteExistingImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <FiTrash size={16} />
              </button>
            </div>
          ))}
        </div>

        {carImages.length > 0 && (
          <>
            <h2 className="text-black font-bold mb-2">Novas imagens:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {carImages.map((item) => (
                <div key={item.name} className="relative">
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(item)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

