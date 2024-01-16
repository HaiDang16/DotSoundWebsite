import { bgColors } from "../utils/styles";
const DashboardCard = ({ icon, name, count }) => {
  const bg_color = bgColors[parseInt(Math.random() * bgColors.length)];

  return (
    <div
      style={{ background: `${bg_color}` }}
      className={`p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center`}
    >
      {icon}
      <p className="text-xl text-black font-semibold">{name}</p>
      <p className="text-sm text-black">{count}</p>
    </div>
  );
};

export default DashboardCard;
