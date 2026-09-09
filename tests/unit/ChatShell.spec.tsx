import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatShell } from "../../src/components/ChatShell";
import { FakeChatService } from "../mocks/fakeChatService";

describe("ChatShell", () => {
  it("renders the single-screen chat surface", () => {
    render(<ChatShell />);

    expect(
      screen.getByRole("heading", { name: "CA Buddy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /calmer first step/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new chat/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Your question")).toBeInTheDocument();
    expect(
      screen.getByText(/consult a chartered accountant/i),
    ).toBeInTheDocument();
  });

  it("shows a submitted question immediately and forwards it to the callback", async () => {
    const user = userEvent.setup();
    const onSubmitMessage = vi.fn().mockResolvedValue(undefined);
    render(<ChatShell onSubmitMessage={onSubmitMessage} />);

    const input = screen.getByLabelText("Your question");
    await user.type(input, "When is my ITR deadline?");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText("When is my ITR deadline?")).toBeInTheDocument();
    expect(onSubmitMessage).toHaveBeenCalledWith("When is my ITR deadline?");
  });

  it("clears the active conversation with New chat", async () => {
    const user = userEvent.setup();
    render(<ChatShell />);

    const input = screen.getByLabelText("Your question");
    await user.type(input, "Do I need to register for GST?");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(
      screen.getByText("Do I need to register for GST?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /new chat/i }));

    expect(
      screen.queryByText("Do I need to register for GST?"),
    ).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("renders the fake service response in the conversation", async () => {
    const user = userEvent.setup();
    const chatService = new FakeChatService({
      response: "Keep your GST invoices organized.",
    });
    render(<ChatShell chatService={chatService} />);

    await user.type(
      screen.getByLabelText("Your question"),
      "How should I prepare for GST?",
    );
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(
      await screen.findByText("Keep your GST invoices organized."),
    ).toBeInTheDocument();
    expect(chatService.calls).toEqual(["How should I prepare for GST?"]);
  });
});
