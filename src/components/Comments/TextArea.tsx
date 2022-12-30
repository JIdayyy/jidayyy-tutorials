/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRouter } from "next/router";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import Spinner from "../MultiSelect/components/Spinner";

export default function TextArea() {
  const { query } = useRouter();
  const { register, handleSubmit, resetField } = useForm();
  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.comment.createComment.useMutation({
    onSuccess: () => {
      utils.comment.getAllCommentsByPost.invalidate({
        slug: query.slug as string,
      });
      resetField("content");
    },
  });
  const onSubmit = (data: FieldValues) => {
    mutate({
      content: data.content,
      slug: query.slug as string,
    });
  };

  return (
    <div className="w-full flex border-t border-b border-blue-50 py-10  space-y-5 flex-col">
      <label htmlFor="content">Your comment</label>
      <textarea
        id="content"
        className="min-h-[200px]"
        {...register("content")}
      />
      <div className="flex w-full justify-end">
        <button
          className="action min-w-[100px] flex justify-center items-center align-middle"
          onClick={handleSubmit(onSubmit)}
          type="button"
        >
          {isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </div>
  );
}
