import Home from "@/app/page";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Integration Test", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Harus menampilkan formulir catatan", () => {
    render(<Home />);

    expect(screen.getByTestId("note-form")).toBeInTheDocument();
    expect(screen.getByTestId("note-title")).toBeInTheDocument();
    expect(screen.getByTestId("note-content")).toBeInTheDocument();
  });

  test("Harus menambahkan catatan baru", () => {
    render(<Home />);

    fireEvent.change(screen.getByTestId("note-title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByTestId("note-content"), {
      target: { value: "Test Content" },
    });
    fireEvent.submit(screen.getByTestId("note-form"));

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("Harus mengedit catatan yang sudah ada", () => {
    render(<Home />);

    fireEvent.change(screen.getByTestId("note-title"), {
      target: { value: "Old Title" },
    });
    fireEvent.change(screen.getByTestId("note-content"), {
      target: { value: "Old Content" },
    });
    fireEvent.submit(screen.getByTestId("note-form"));

    fireEvent.click(screen.getByTestId("edit"));

    fireEvent.change(screen.getByTestId("note-title"), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByTestId("note-content"), {
      target: { value: "Updated Content" },
    });
    fireEvent.submit(screen.getByTestId("note-form"));

    expect(screen.getByText("Updated Title")).toBeInTheDocument();
    expect(screen.getByText("Updated Content")).toBeInTheDocument();
  });

  test("Harus menghapus sebuah catatan", () => {
    render(<Home />);

    fireEvent.change(screen.getByTestId("note-title"), {
      target: { value: "Note to Delete" },
    });
    fireEvent.change(screen.getByTestId("note-content"), {
      target: { value: "Content" },
    });
    fireEvent.submit(screen.getByTestId("note-form"));

    fireEvent.click(screen.getByTestId("delete"));

    expect(screen.queryByText("Note to Delete")).not.toBeInTheDocument();
  });
});
