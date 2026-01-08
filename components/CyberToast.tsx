import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    duration?: number;
}

const CyberToast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            color: 'cyber-green',
            bgColor: 'bg-cyber-green/10',
            borderColor: 'border-cyber-green/50',
            glowColor: 'shadow-[0_0_20px_rgba(10,255,96,0.3)]'
        },
        error: {
            icon: XCircle,
            color: 'red-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/50',
            glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
        },
        warning: {
            icon: AlertCircle,
            color: 'yellow-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/50',
            glowColor: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
        },
        info: {
            icon: Info,
            color: 'cyber-cyan',
            bgColor: 'bg-cyber-cyan/10',
            borderColor: 'border-cyber-cyan/50',
            glowColor: 'shadow-[0_0_20px_rgba(0,243,255,0.3)]'
        }
    };

    const Icon = config[type].icon;

    return (
        <div className={`fixed top-24 right-6 z-[100] animate-in slide-in-from-right-full duration-300 ${config[type].glowColor}`}>
            <div className={`${config[type].bgColor} ${config[type].borderColor} border-2 p-4 pr-12 max-w-md backdrop-blur-md relative overflow-hidden`}>
                {/* Animated background lines */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse delay-100"></div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                    <Icon className={`text-${config[type].color} shrink-0 mt-0.5`} size={20} />
                    <p className="font-mono text-sm text-white uppercase tracking-wide leading-relaxed">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className={`absolute top-2 right-2 text-gray-500 hover:text-${config[type].color} transition-colors`}
                >
                    <X size={18} />
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
                    <div
                        className={`h-full bg-${config[type].color} animate-shrink-width`}
                        style={{ animationDuration: `${duration}ms` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default CyberToast;
