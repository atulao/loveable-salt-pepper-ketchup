
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/index";
import MapPage from "@/pages/MapPage";
import EventsPage from "@/pages/EventsPage";
import BuildingsPage from "@/pages/BuildingsPage";
import BuildingDetailPage from "@/pages/BuildingDetailPage";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/layout/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/buildings" element={<BuildingsPage />} />
        <Route path="/buildings/:id" element={<BuildingDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
