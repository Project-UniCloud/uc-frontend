import { FaTrash } from "react-icons/fa";

export const getColumns = ({
  groupId,
  resourceId,
  onDeleted,
  onDeleteClick,
  canDelete = false,
}) => {
  const columns = [
    { key: "createdBy", header: "Utworzone przez" },
    { key: "name", header: "Nazwa" },
    { key: "resourceGlobalId", header: "Global ID" },
    { key: "resourceId", header: "ID zasobu" },
    { key: "service", header: "Usługa" },
    { key: "type", header: "Typ" },
    { key: "status", header: "Status" },
  ];

  if (canDelete) {
    columns.push({
      key: "delete",
      header: "Akcje",
      render: (row) => {
        const isTerminatedOrShuttingDown =
          row.status === "terminated" || row.status === "shutting-down";

        return (
          <button
            onClick={(e) => {
              if (!isTerminatedOrShuttingDown) {
                e.stopPropagation();
                onDeleteClick?.({
                  groupId,
                  resourceId,
                  resourceGlobalId: row.resourceGlobalId,
                });
              }
            }}
            disabled={isTerminatedOrShuttingDown}
            className={`${
              isTerminatedOrShuttingDown
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800 cursor-pointer"
            }`}
            aria-label="Usuń"
          >
            <FaTrash />
          </button>
        );
      },
    });
  }

  return columns;
};
