
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  additionalText?: string;
  className?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  additionalText, 
  className = '' 
}: FeatureCardProps) => {
  return (
    <div 
      className={`bg-black/30 border border-white/10 p-6 rounded-xl transition-all duration-300 hover:border-truthscan-blue/30 ${className}`}
    >
      <div className="text-truthscan-blue mb-5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <p className="text-white/70 mb-4">{description}</p>
      {additionalText && (
        <p className="text-white/50 text-sm">{additionalText}</p>
      )}
    </div>
  );
};

export default FeatureCard;
