import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { GrLocation } from "react-icons/gr";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import logoImg from "../../assets/easysisLogo.png";
import { Container } from "../../components/container";
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

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const data = await vehicleService.getAllVehicles();
        setCars(data);
        toast.success("Catálogo carregado com sucesso!");
      } catch (err) {
        toast.error("Erro ao carregar catálogo de veículos!");
        console.error("Erro ao buscar veículos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BarLoader color={"#DC3237"} />
            <p className="text-white mt-4">Carregando catálogo...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <header className="flex items-center justify-center w-full max-w-xs mx-auto mb-8">
        <img src={logoImg} alt="Logo da Easysis" className="w-full" />
      </header>

      <section className="bg-white p-4 rounded-lg w-full mb-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Catálogo de Veículos
        </h1>
        <p className="text-center text-gray-600">
          Confira todos os veículos disponíveis
        </p>
      </section>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <section
            key={car._id}
            className="w-full bg-white rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link to={`/car/${car._id}`}>
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
                  alt="Veículo"
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
              <p className="font-bold text-lg text-red-600 px-2 mb-2">
                R$ {parseFloat(car.price as string).toLocaleString("pt-BR")}
              </p>
            </Link>
          </section>
        ))}
      </main>

      {cars.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-white text-lg">
            Nenhum veículo cadastrado no momento
          </p>
        </div>
      )}
    </Container>
  );
}
