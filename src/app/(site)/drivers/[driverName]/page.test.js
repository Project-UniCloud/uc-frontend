import { render, screen, fireEvent } from "@testing-library/react";
import DriverDetailsPage from "@/app/(site)/drivers/[driverName]/page";
import { useDriverDetailPage } from "@/lib/views/drivers/driverName/hooks";

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return { ...actual, use: (value) => value };
});

jest.mock("@/lib/views/drivers/driverName/hooks", () => ({
  useDriverDetailPage: jest.fn(),
}));

jest.mock("@/components/utils/Tabs", () => () => <div data-testid="tabs" />);
jest.mock("@/components/utils/InputForm", () => ({ label }) => (
  <div>{label}</div>
));

jest.mock("@/components/views/DataTableView", () => () => (
  <div data-testid="datatable" />
));

jest.mock("@/components/resources/AddResourceTypeModal", () => () => (
  <div data-testid="add-resource-type" />
));

jest.mock("@/components/utils/Hint", () => () => <div data-testid="hint" />);

describe("DriverDetailsPage", () => {
  test("renders edit button and calls handleEditClick", () => {
    const handleEditClick = jest.fn();

    useDriverDetailPage.mockReturnValue({
      activeTab: "Ustawienia",
      driverData: { id: "id", name: "n", clean: "c", limit: "0" },
      driverResourceTypesData: [],
      loading: false,
      formLoading: false,
      error: null,
      validationError: null,
      editing: false,
      page: 0,
      setPage: jest.fn(),
      pageSize: 10,
      setPageSize: jest.fn(),
      totalPages: 0,
      isOpenAddModal: false,
      setIsOpenAddModal: jest.fn(),
      handleTabChange: jest.fn(),
      tableData: [],
      handleChange: () => jest.fn(),
      handleEditClick,
      handleCancelEdit: jest.fn(),
    });

    render(<DriverDetailsPage params={{ driverName: "drv-1" }} />);

    fireEvent.click(screen.getByText("Edytuj"));
    expect(handleEditClick).toHaveBeenCalled();
  });
});
