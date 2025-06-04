import { Info } from "lucide-react";
import { type MouseEventHandler, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface Position {
  top: number;
  left: number;
}

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

  const showTooltip = useCallback<MouseEventHandler<HTMLSpanElement>>((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 5, // 若干下に表示
      left: rect.left + window.scrollX,     // 左端を合わせる
    });
    setVisible(true);
  }, []);

  const hideTooltip = (): void => setVisible(false);

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <span
        className="ml-2 inline-flex items-center text-blue-400 cursor-pointer"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={visible ? hideTooltip : showTooltip} // クリックでも表示/非表示を切り替え
      >
        <Info size={18} />
      </span>
      {visible &&
        createPortal(
          <div
            className="absolute bg-slate-700 text-slate-100 px-3 py-2 rounded-md text-xs shadow-lg border border-slate-600 z-50 w-max max-w-xs"
            style={{ top: position.top, left: position.left }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};