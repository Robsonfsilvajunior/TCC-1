import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelHeader";
import { AuthContext } from "../../contexts/authContext";
import { vehicleService } from "../../services/mongodbConnection";

interface CarProps {
  _id: string;
  name: string;
  model: string;
  version: string;
  year: string;
  km: string;
  city: string;
  state: string;
  price: string | number;
  images: string[];
  uid?: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await vehicleService.getAllVehicles();
        // Filtrar apenas carros do usuário logado
        const userCars = data.filter((car: CarProps) => car.uid === user?.uid);
        setCars(userCars);
      } catch (err) {
        toast.error("Erro ao carregar veículos!");
      }
    }
    fetchCars();
  }, [user]);

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleDeleteCar(car: CarProps) {
    // Verificar se o usuário é o proprietário
    if (car.uid !== user?.uid) {
      toast.error("Você não tem permissão para deletar este veículo!");
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar ${car.name} ${car.model}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(car._id);
      // Remover o carro da lista local
      setCars((prevCars) => prevCars.filter((c) => c._id !== car._id));
      toast.success("Veículo deletado com sucesso!");
    } catch (err) {
      toast.error("Erro ao deletar veículo!");
      console.error("Erro ao deletar:", err);
    }
  }


  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <section
            key={car._id}
            className="w-full bg-white rounded-lg cursor-default shadow-lg"
          >
            <div
              className="w-full h-56 max-h-72 rounded-lg relative"
              style={{
                display: loadImages.includes(car._id) ? "none" : "block",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <BarLoader color={"#DC3237"} />
              </div>
            </div>
            {car.images && car.images.length > 0 && (
              <img
                src={car.images[0]}
                alt="Veiculo"
                className="w-full rounded-t-lg mb-2 h-56 max-h-72 object-cover"
                onLoad={() => handleImageLoad(car._id)}
                style={{
                  display: loadImages.includes(car._id) ? "block" : "none",
                }}
              />
            )}
            <p className="font-bold my-2 px-2 uppercase lg:text-sm">
              {car.name} {car.model}
            </p>
            <p className="text-zinc-500 px-2 text-xs uppercase">
              {car.version}
            </p>
            <p className="text-zinc-500 px-2 text-xs">
              {car.year} | {parseFloat(car.km).toLocaleString("pt-BR")} km
            </p>
            <p className="text-zinc-500 px-2 text-xs">
              <GrLocation className="inline mr-1" />
              {car.city} - {car.state}
            </p>
            <p className="font-bold text-lg text-red-600 px-2">
              R$ {parseFloat(car.price as string).toLocaleString("pt-BR")}
            </p>
            <div className="flex gap-2 p-2">
              <Link
                to={`/car/${car._id}`}
                className="bg-blue-600 w-full text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Ver detalhes
              </Link>
              <Link
                to={`/dashboard/edit/${car._id}`}
                className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <FiEdit size={20} />
              </Link>
              <button
                onClick={() => handleDeleteCar(car)}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </section>
        ))}
      </main>
      {cars.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
        </div>
      )}
    </Container>
  );
}
