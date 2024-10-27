import { PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import {  useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "../../services/getProfileDetails";
const BASE_URL = import.meta.env.VITE_API_URL;
const ProfileCard = styled(Card)({
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
  padding: "20px",
});
const AvatarStyled = styled(Avatar)({
  width: "100px",
  height: "100px",
  margin: "0 auto",
});
export default function ProfilePicture({ userData, refetch }) {
  const { mutate: uploadPictureMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("¡Imagen de perfil actualizada exitosamente!", {
        toastId: "¡Imagen de perfil actualizada exitosamente! 2",
        onClose: () => {
          refetch();
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleImageUpload = (event) => {
  
    const file = event.target.files[0];
    if (file) {
      uploadPictureMutation(file);
    }
  };
  

  return (
    <ProfileCard sx={{ bgcolor: "#000", color: "#fff" }}>
      <CardContent sx={{ position: "relative" }}>
        {isUpdating ? (
          <CircularProgress />
        ) : (
          <AvatarStyled src={`${BASE_URL}/${userData.picture}`} />
        )}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file"
          type="file"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="icon-button-file"
          style={{ position: "absolute", top: 100, right: 100 }}
        >
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            type="submit"
          >
            <PhotoCamera />
          </IconButton>
        </label>

        <Typography
          variant="h5"
          align="center"
          sx={{ mt: 3, fontWeight: "bold", fontFamily: "cursive" }}
        >
          {userData.firstName + " " + userData.lastName}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          {userData.title}
        </Typography>
      </CardContent>
    </ProfileCard>
  );
}
