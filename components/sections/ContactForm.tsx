"use client";

import { useActionState, type ReactNode } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-line-strong bg-surface px-3.5 text-fg placeholder:text-faint aria-[invalid=true]:border-accent";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <Field id="name" label="Name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={state.values?.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(inputClass, "min-h-11")}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="you@company.com"
          defaultValue={state.values?.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(inputClass, "min-h-11")}
        />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          defaultValue={state.values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputClass, "resize-y py-2.5")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span data-magnetic className="inline-flex">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
          </Button>
        </span>
        <p
          role="status"
          className={cn(
            "text-sm",
            state.status === "success" ? "text-fg" : "text-muted",
          )}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="caption text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
