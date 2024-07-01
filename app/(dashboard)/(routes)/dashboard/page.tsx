import { PinContainer } from "@/components/ui/3d-pin";
import { dashboardData } from "@/constants";
import Image from "next/image";

const Dashboard = () => {
  return (
      <div className="w-full h-screen flex flex-wrap items-center justify-center p-4 gap-12">
        {dashboardData.map((item) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={item.id}
          >
            <PinContainer title={item.link} href={item.link}>
              <div className="relative flex items-center justify-center lg:w-80 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <Image width={100} height={100} src="/bg.png" alt="bgimg" />
                </div>
                <Image
                  width={200}
                  height={200}
                  src={item.img}
                  alt="cover"
                  className="z-10 absolute bottom-0 w-full h-full object-cover"
                />
              </div>

              <h1 className="font-bold lg:text-xl md:text-lg text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-lg lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.desc}
              </p>
            </PinContainer>
          </div>
        ))}
      </div>
  );
};

export default Dashboard;
