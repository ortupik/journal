'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successNotify } from '@/helpers/toastifyHlp';
import { deleteJournal } from '@/actions/journal';

type Props = {
  id: string;
  closeModal: () => void;
};

function DeleteModal({ id, closeModal }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      successNotify('Journal deleted successfully');
      queryClient.invalidateQueries(['journals']);
      closeModal();
    }
  });

  const onConfirm = () => {
    mutate(id);
  };

  return (
    <div className='fixed top-0 left-0 z-20 h-full w-full bg-black/50'>
      <div className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 rounded-lg bg-white p-12'>
        <h2 className='text-xl font-medium'>
          Are you sure you want to delete this journal? 😥
        </h2>

        <h3 className='text-sm text-red-600'>
          It will permanently delete your journal and related comments.
        </h3>

        <div className='flex justify-between gap-4'>
          <button
            onClick={closeModal}
            disabled={isLoading}
            className='w-32 bg-slate-200 px-4 py-2 text-sm hover:bg-slate-300'
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className='w-32 bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
