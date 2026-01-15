import { render, screen, fireEvent } from "@testing-library/react";
import LecturerDetailsPage from "@/app/(site)/list-lecturers/[lecturerId]/page";
import { useLecturerDetailPage } from "@/lib/views/list-lecturers/lecturerId/hooks";

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return { ...actual, use: (value) => value };
});

jest.mock("@/lib/views/list-lecturers/lecturerId/hooks", () => ({
  useLecturerDetailPage: jest.fn(),
}));

jest.mock("@/components/utils/InputForm", () => ({ label }) => (
  <div>{label}</div>
));

describe("LecturerDetailsPage", () => {
  test("renders edit button and calls handleEditClick", () => {
    const handleEditClick = jest.fn();

    useLecturerDetailPage.mockReturnValue({
      lecturer: { firstName: "Jan", lastName: "Kowalski", email: "a@b.c" },
      loading: false,
      error: null,
      validationError: null,
      formLoading: false,
      editing: false,
      handleChange: () => jest.fn(),
      handleEditClick,
      handleCancelEdit: jest.fn(),
    });

    render(<LecturerDetailsPage params={{ lecturerId: "lec-1" }} />);

    fireEvent.click(screen.getByText("Edytuj"));
    expect(handleEditClick).toHaveBeenCalled();
  });
});
