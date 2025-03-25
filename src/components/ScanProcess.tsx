
interface ScanProcessProps {
  step: string;
  title: string;
  description: string;
}

const ScanProcess = ({ step, title, description }: ScanProcessProps) => {
  return (
    <div className="flex flex-col items-center text-center max-w-xs mx-auto">
      <div className="bg-black/40 border border-white/10 h-16 w-16 flex items-center justify-center rounded-xl mb-5 text-xl font-bold text-white">
        {step}
      </div>
      <h3 className="text-white text-lg font-medium mb-3">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
};

export default ScanProcess;
