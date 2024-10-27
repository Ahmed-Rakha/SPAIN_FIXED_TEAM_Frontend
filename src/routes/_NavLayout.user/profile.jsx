import { createFileRoute } from "@tanstack/react-router";
import ProfilePicture from "../../components/ProfileDetails/ProfilePicture";
import ProfileData from "../../components/ProfileDetails/ProfileData";
import ChangePassword from "../../components/ProfileDetails/ChangePassword";
import {
  CardContent,
  Divider,
  Box,
  Grid2,
  styled,
  Typography,
  Card,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProfileDetails } from "../../services/getProfileDetails";
import LoadingSpinner from "../../components/Spinners/LoadingSpinner";
import UnauthenticatedFallback from "../../components/Auth/UnAuthenticated";
import { motion } from "framer-motion";

const ProfileCard = styled(Card)({
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
  padding: "20px",
});
// Variants for animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
// Variants for animation
const gridVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const Route = createFileRoute("/_NavLayout/user/profile")({
  component: ProfileDetailsPage,
});

export default function ProfileDetailsPage() {
  const {
    data: user,
    isPending: isFetchingUser,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["profileDetails"],
    queryFn: getProfileDetails,
  });

  if (isFetchingUser) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <UnauthenticatedFallback message={error.message} />;
  }
  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Grid2
        container
        spacing={4}
        component={motion.div}
        variants={gridVariants}
      >
        <Grid2
          size={{ xs: 12, md: 4 }}
          component={motion.div}
          variants={gridVariants}
          transition={{ delay: 0.2 }}
        >
          {/* Render Profile Picture COMPONENT */}
          <ProfilePicture userData={user} refetch={refetch} />
        </Grid2>
        <Grid2
          size={{ xs: 12, md: 8 }}
          component={motion.div}
          variants={gridVariants}
          transition={{ delay: 0.4 }}
        >
          <ProfileCard
            component={motion.div}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: "easeOut" }}
            sx={{
              bgcolor: "#000",
              color: "#fff",
              height: "600px",
              overflow: "auto",
              webkitOverflowScrolling: "touch",

              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
                backgroundColor: "#ddd",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "50%",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f9f9f9",
              },
              "&:hover::-webkit-scrollbar-thumb": {
                backgroundColor: "#9c27b0",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Typography variant="body1">
                Personaliza cómo aparecerá la información de tu perfil
              </Typography>
              <Divider color="white" sx={{ my: 2 }} />
              {/* Render Profile Data COMPONENT  */}
              <ProfileData userData={user} />
              <Divider color="white" sx={{ my: 2 }} />
              {/* Render Change Password COMPONENT */}
              <ChangePassword refetch={refetch} />
            </CardContent>
          </ProfileCard>
        </Grid2>
      </Grid2>
    </Box>
  );
}
