import { Tooltip } from "react-tooltip";
import { FaQuestion } from "react-icons/fa";
import { useId } from "react";

export default function Hint({ hint }) {
  const tooltipId = `tooltip-${useId()}`;
  return (
    <>
      {hint && (
        <>
          <a
            data-tooltip-id={tooltipId}
            data-tooltip-content={hint}
            className="text-gray-300 hover:text-gray-600"
          >
            <FaQuestion className="w-2" />
          </a>
          <Tooltip
            arrowColor="black"
            border="1px solid gray"
            className="border-radius: 10px"
            id={tooltipId}
            style={{
              borderRadius: 10,
              backgroundColor: "#f3f4f6",
              color: "#000000",
              whiteSpace: "pre-line",
              maxWidth: "350px",
              wordBreak: "break-word",
              zIndex: 9999,
              opacity: 1,
            }}
          />
        </>
      )}
    </>
  );
}
