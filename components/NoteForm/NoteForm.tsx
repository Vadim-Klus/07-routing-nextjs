"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import styles from "./NoteForm.module.css";

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Content too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const formik = useFormik({
    initialValues: { title: "", content: "", tag: "Todo" },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...formik.getFieldProps("title")}
          className={styles.input}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={styles.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          {...formik.getFieldProps("content")}
          className={styles.textarea}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={styles.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          {...formik.getFieldProps("tag")}
          className={styles.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <span className={styles.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
