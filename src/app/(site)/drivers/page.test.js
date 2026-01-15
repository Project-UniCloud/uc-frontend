import { render, screen, fireEvent } from "@testing-library/react";
import DriversPage from "@/app/(site)/drivers/page";
import { useDriversPage } from "@/lib/views/drivers/hooks";

jest.mock("@/lib/views/drivers/hooks", () => ({
  useDriversPage: jest.fn(),
}));

jest.mock("@/components/drivers/AddDriverModal", () => () => (
  <div data-testid="add-driver-modal" />
));

jest.mock("@/components/views/DataTableView", () => (props) => (
  <div>
    <div data-testid="left-actions">{props.leftActions}</div>
    <div data-testid="datatable">{(props.data || []).length}</div>
  </div>
));

jest.mock("@/components/utils/Hint", () => () => <div data-testid="hint" />);

describe("DriversPage", () => {
  test("opens modal after clicking add driver button", () => {
    const setIsOpen = jest.fn();

    useDriversPage.mockReturnValue({
      loading: false,
      error: null,
      isOpen: false,
      setIsOpen,
      page: 0,
      setPage: jest.fn(),
      pageSize: 10,
      setPageSize: jest.fn(),
      totalPages: 0,
      fetchCloudAccesses: jest.fn(),
      tableData: [],
    });

    render(<DriversPage />);

    fireEvent.click(screen.getByText(/Dodaj sterownik/i));
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });
});
