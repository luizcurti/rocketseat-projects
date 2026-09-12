import {toast} from "sonner";
import {api} from "../../../helpers/api";
import {useQueryClient} from "@tanstack/react-query";

export default function usePhotoAlbums() {
  const queryClient = useQueryClient();

  async function managePhotoOnAlbum(photoId: string, albumsIds: string[]) {
    try {
      await api.put(`/photos/${photoId}/albums`, {
        albumsIds,
      });

      queryClient.invalidateQueries({queryKey: ["photo", photoId]});
      queryClient.invalidateQueries({queryKey: ["photos"]});

      toast.success("Albums updated");
    } catch (error) {
      toast.error("Error managing photo albums");
      throw error;
    }
  }

  return {
    managePhotoOnAlbum,
  };
}
