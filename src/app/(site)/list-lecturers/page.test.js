import { render, screen, fireEvent } from "@testing-library/react";
import ListLecturersPage from "@/app/(site)/list-lecturers/page";
import { useListLecturersPage } from "@/lib/views/list-lecturers/hook";

jest.mock("@/lib/views/list-lecturers/hook", () => ({
  useListLecturersPage: jest.fn(),
}));

jest.mock("@/components/lecturer/AddLecturerModal", () => () => (
  <div data-testid="add-lecturer-modal" />
));

jest.mock("@/components/views/DataTableView", () => (props) => (
  <div>
    <div data-testid="left-actions">{props.leftActions}</div>
    <div data-testid="datatable">{(props.data || []).length}</div>
  </div>
));

jest.mock("@/components/utils/Hint", () => () => <div data-testid="hint" />);

describe("ListLecturersPage", () => {
  test("opens modal after clicking add button", () => {
    const setIsOpen = jest.fn();

    useListLecturersPage.mockReturnValue({
      lecturers: [],
      loading: false,
      error: null,
      isOpen: false,
      searchQuery: "",
      page: 0,
      pageSize: 10,
      totalPages: 0,
      setIsOpen,
      setSearchQuery: jest.fn(),
      setPage: jest.fn(),
      setPageSize: jest.fn(),
      fetchLecturers: jest.fn(),
    });

    render(<ListLecturersPage />);

    fireEvent.click(screen.getByText(/Dodaj Prowadzącego/i));
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });
});
