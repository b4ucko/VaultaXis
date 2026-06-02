
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import NasSetup from "./pages/NasSetup";
import NasFiles from "./pages/NasFiles";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SecurityManifest from "./pages/SecurityManifest";
import AuditLogsPage from "./pages/AuditLogsPage";
import AesSpec from "./pages/AesSpec";
import Pbkdf2Spec from "./pages/Pbkdf2Spec";
import WebCryptoSpec from "./pages/WebCryptoSpec";
import WebdavIntegration from "./pages/WebdavIntegration";
import CloudSync from "./pages/CloudSync";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nas-setup" element={<NasSetup />} />
            <Route path="/nas-files" element={<NasFiles />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/security-manifest" element={<SecurityManifest />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/spec/aes-256-gcm" element={<AesSpec />} />
            <Route path="/spec/pbkdf2" element={<Pbkdf2Spec />} />
            <Route path="/spec/web-crypto" element={<WebCryptoSpec />} />
            <Route path="/webdav" element={<WebdavIntegration />} />
            <Route path="/cloud-sync" element={<CloudSync />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
