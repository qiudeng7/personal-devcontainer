# Dialog contract

Prefer the native `<dialog>` element. Provide a visible close action, close on Escape, and return
focus to the trigger. A command menu may close after a command; a destructive confirmation must
remain open until the user explicitly confirms or cancels.

The example uses a `method="dialog"` form so its close control works without JavaScript. Opening the
dialog still belongs to the host application, which should call `showModal()` from a real trigger.
