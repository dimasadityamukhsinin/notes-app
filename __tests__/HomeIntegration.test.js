import Home from "@/app/page";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Home Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("should render the note form", () => {
    render(<Home />);

    expect(screen.getByTestId("note-form")).toBeInTheDocument();
    expect(screen.getByTestId("note-title")).toBeInTheDocument();
    expect(screen.getByTestId("note-content")).toBeInTheDocument();
  });

  test("should add a new note", () => {
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

  test("should edit an existing note", () => {
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

  test("should delete a note", () => {
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
