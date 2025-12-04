import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Video,
  MessageSquare,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Sparkles,
  Eye,
  Star,
  BookMarked,
  Lightbulb,
  GraduationCap,
  Phone,
  Mail,
  Download,
  ExternalLink,
  ArrowLeft,
  Filter,
  Printer,
  Share2,
  Heart,
  History,
  Send,
  PlayCircle,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner@2.0.3";
import { 
  helpStore, 
  type FAQ, 
  type KnowledgeArticle, 
  type SearchResult,
  type HelpCategory,
  type GlossaryTerm,
  type FavoriteItem,
  type RecentItem
} from "../utils/helpStore";
import { messagesStore } from "../utils/messagesStore";
import { ArticleActions } from "../components/ArticleActions";
import { FavoritesView, RecentsView, ContactSupportView } from "../components/HelpCenterViews";

export function CentroAyudaPage() {
  const [view, setView] = useState<"home" | "search" | "article" | "faq-detail" | "category" | "glossary" | "videos" | "favorites" | "recents" | "contact">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);

  const stats = helpStore.getHelpStats();
  const categories = helpStore.getCategories();

  // Cargar favoritos y recientes
  useEffect(() => {
    setFavorites(helpStore.getFavorites());
    setRecents(helpStore.getRecents());
  }, [view]);

  // Búsqueda con debounce y sugerencias IA
  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(async () => {
        // Obtener sugerencias de IA
        const suggestions = await helpStore.getAISuggestions(searchQuery);
        setAiSuggestions(suggestions);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setAiSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setView("search");

    try {
      const results = await helpStore.search(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast.error("Error al buscar");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectArticle = (articleId: string) => {
    const article = helpStore.getArticleById(articleId);
    if (article) {
      setSelectedArticle(article);
      setView("article");
      // Agregar a recientes
      helpStore.addRecent(articleId, "article");
    }
  };

  const handleSelectFAQ = (faqId: string) => {
    const allFAQs = helpStore.getAllFAQs();
    const faq = allFAQs.find(f => f.id === faqId);
    if (faq) {
      setSelectedFAQ(faq);
      setView("faq-detail");
      // Agregar a recientes
      helpStore.addRecent(faqId, "faq");
    }
  };

  const handleSelectCategory = (category: HelpCategory) => {
    setSelectedCategory(category);
    setView("category");
  };

  const handleBack = () => {
    setView("home");
    setSelectedArticle(null);
    setSelectedFAQ(null);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-white mb-2">Centro de Ayuda y Soporte</h1>
              <p className="text-indigo-50 text-lg max-w-2xl">
                Encuentra respuestas, guías paso a paso, tutoriales y toda la información que necesitas para usar ePrescription
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {stats.totalArticles} Artículos
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  {stats.totalFAQs} FAQs
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <BookMarked className="w-3 h-3 mr-1" />
                  {stats.totalGlossaryTerms} Términos
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {stats.avgHelpfulRate}% Útil
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación rápida */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => setView("favorites")}
          className="gap-2 hover:border-pink-300 hover:bg-pink-50"
        >
          <Heart className="w-4 h-4" />
          Favoritos {favorites.length > 0 && `(${favorites.length})`}
        </Button>
        <Button
          variant="outline"
          onClick={() => setView("recents")}
          className="gap-2 hover:border-blue-300 hover:bg-blue-50"
        >
          <History className="w-4 h-4" />
          Recientes {recents.length > 0 && `(${recents.length})`}
        </Button>
        <Button
          variant="outline"
          onClick={() => setView("glossary")}
          className="gap-2 hover:border-purple-300 hover:bg-purple-50"
        >
          <BookMarked className="w-4 h-4" />
          Glosario
        </Button>
        <Button
          variant="outline"
          onClick={() => setView("contact")}
          className="gap-2 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <MessageSquare className="w-4 h-4" />
          Contactar soporte
        </Button>
      </div>

      {/* Barra de búsqueda principal */}
      <Card className="border-2 border-indigo-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Busca tu pregunta aquí... (Ej: ¿Cómo crear una receta?)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 h-12 text-base"
              />
              {searchQuery && (
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-pulse" />
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={searching || !searchQuery.trim()}
              className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {searching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Buscando...
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Sugerencias de IA */}
          {aiSuggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                Sugerencias de búsqueda:
              </p>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch();
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista condicional */}
      {view === "home" && <HomeView onSelectCategory={handleSelectCategory} onSelectArticle={handleSelectArticle} onSelectFAQ={handleSelectFAQ} setView={setView} />}
      {view === "search" && <SearchView results={searchResults} query={searchQuery} onSelectArticle={handleSelectArticle} onSelectFAQ={handleSelectFAQ} onBack={handleBack} />}
      {view === "article" && selectedArticle && <ArticleView article={selectedArticle} onBack={handleBack} onRefreshFavorites={() => setFavorites(helpStore.getFavorites())} />}
      {view === "faq-detail" && selectedFAQ && <FAQDetailView faq={selectedFAQ} onBack={handleBack} onRefreshFavorites={() => setFavorites(helpStore.getFavorites())} />}
      {view === "category" && selectedCategory && <CategoryView category={selectedCategory} onSelectArticle={handleSelectArticle} onSelectFAQ={handleSelectFAQ} onBack={handleBack} />}
      {view === "glossary" && <GlossaryView onBack={handleBack} />}
      {view === "videos" && <VideosView onBack={handleBack} />}
      {view === "favorites" && <FavoritesView items={favorites} onSelectArticle={handleSelectArticle} onSelectFAQ={handleSelectFAQ} onBack={handleBack} onRemove={() => setFavorites(helpStore.getFavorites())} />}
      {view === "recents" && <RecentsView items={recents} onSelectArticle={handleSelectArticle} onSelectFAQ={handleSelectFAQ} onBack={handleBack} onClear={() => setRecents([])} />}
      {view === "contact" && <ContactSupportView onBack={handleBack} />}
    </div>
  );
}

// ============================================
// HOME VIEW
// ============================================
function HomeView({ 
  onSelectCategory, 
  onSelectArticle,
  onSelectFAQ,
  setView
}: { 
  onSelectCategory: (cat: HelpCategory) => void;
  onSelectArticle: (id: string) => void;
  onSelectFAQ: (id: string) => void;
  setView: (view: "home" | "search" | "article" | "faq-detail" | "category" | "glossary" | "videos" | "favorites" | "recents" | "contact") => void;
}) {
  const categories = helpStore.getCategories();
  const featuredArticles = helpStore.getFeaturedArticles();
  const popularFAQs = helpStore.getPopularFAQs(8);

  return (
    <div className="space-y-6">
      {/* Categorías principales */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            Explora por categoría
          </CardTitle>
          <CardDescription className="text-base">
            Encuentra ayuda organizada por módulos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = require("lucide-react")[category.icon];
              return (
                <button
                  key={category.value}
                  onClick={() => onSelectCategory(category.value)}
                  className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                >
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-indigo-600 transition-colors">
                      {category.label}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Artículos destacados */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-amber-600 text-white p-2 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            Guías destacadas
          </CardTitle>
          <CardDescription className="text-base">
            Los artículos más útiles y completos
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="border border-border rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                    {helpStore.getCategories().find(c => c.value === article.category)?.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </div>
                </div>
                <h4 className="font-medium mb-2 group-hover:text-amber-600 transition-colors">
                  {article.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {article.difficulty === "beginner" ? "Básico" : article.difficulty === "intermediate" ? "Intermedio" : "Avanzado"}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs populares */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-2 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            Preguntas frecuentes
          </CardTitle>
          <CardDescription className="text-base">
            Las respuestas que más buscan nuestros usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {popularFAQs.map((faq) => (
              <div
                key={faq.id}
                onClick={() => onSelectFAQ(faq.id)}
                className="border border-border rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 group-hover:text-emerald-600 transition-colors">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {helpStore.getCategories().find(c => c.value === faq.category)?.label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {faq.popularity} vistas
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recursos adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50" onClick={() => setView("videos")}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white p-4 rounded-xl mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-2">Video tutoriales</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Aprende visualmente con nuestros videos paso a paso
              </p>
              <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); setView("videos"); }}>
                <PlayCircle className="w-4 h-4 mr-2" />
                Ver videos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50" onClick={() => setView("glossary")}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-600 text-white p-4 rounded-xl mb-4">
                <BookMarked className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-2">Glosario médico</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Definiciones de términos técnicos y acrónimos
              </p>
              <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); setView("glossary"); }}>
                <BookMarked className="w-4 h-4 mr-2" />
                Ver glosario
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-rose-50 to-pink-50" onClick={() => setView("contact")}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-rose-600 text-white p-4 rounded-xl mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-2">Contactar soporte</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ¿No encuentras lo que buscas? Escríbenos
              </p>
              <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); setView("contact"); }}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar mensaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de contacto */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>¿Necesitas ayuda personalizada?</strong> Nuestro equipo de soporte está disponible de lunes a viernes de 8:00 AM a 6:00 PM.
          <div className="flex gap-4 mt-2 text-sm">
            <a 
              href="tel:+50622223333" 
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline transition-colors"
            >
              <Phone className="w-3 h-3" />
              +506 2222-3333
            </a>
            <a 
              href="mailto:soporte@eprescription.cr?subject=Solicitud de soporte - ePrescription"
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline transition-colors"
            >
              <Mail className="w-3 h-3" />
              soporte@eprescription.cr
            </a>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ============================================
// SEARCH VIEW
// ============================================
function SearchView({ 
  results, 
  query,
  onSelectArticle,
  onSelectFAQ,
  onBack 
}: { 
  results: SearchResult[];
  query: string;
  onSelectArticle: (id: string) => void;
  onSelectFAQ: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle>
              Resultados de búsqueda para: "{query}"
            </CardTitle>
            <CardDescription>
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="font-medium mb-2">No se encontraron resultados</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Intenta con otras palabras clave o navega por categorías
            </p>
            <Button onClick={onBack} variant="outline">
              Volver al inicio
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => result.type === "article" ? onSelectArticle(result.id) : onSelectFAQ(result.id)}
                className="border border-border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    result.type === "article" 
                      ? "bg-amber-100 text-amber-600" 
                      : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {result.type === "article" ? <FileText className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium group-hover:text-indigo-600 transition-colors">
                        {result.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {helpStore.getCategories().find(c => c.value === result.category)?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.snippet}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// ARTICLE VIEW
// ============================================
function ArticleView({ article, onBack, onRefreshFavorites }: { article: KnowledgeArticle; onBack: () => void; onRefreshFavorites: () => void }) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [isFavorite, setIsFavorite] = useState(helpStore.isFavorite(article.id, "article"));
  const relatedArticles = helpStore.getRelatedArticles(article.id);

  const handleFeedback = async (isHelpful: boolean) => {
    setHelpful(isHelpful);
    if (isHelpful) {
      await helpStore.markAsHelpful(article.id, "article");
      toast.success("¡Gracias por tu feedback!");
    } else {
      await helpStore.markAsNotHelpful(article.id, "article");
      toast.info("Gracias, trabajaremos en mejorar este contenido");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <CardDescription className="text-base mt-2">{article.summary}</CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">
              {helpStore.getCategories().find(c => c.value === article.category)?.label}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {article.estimatedTime}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <GraduationCap className="w-3 h-3" />
              {article.difficulty === "beginner" ? "Básico" : article.difficulty === "intermediate" ? "Intermedio" : "Avanzado"}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Eye className="w-3 h-3" />
              {article.views} vistas
            </Badge>
          </div>
          
          {/* Acciones del artículo */}
          <div className="mt-4">
            <ArticleActions 
              article={article}
              type="article"
              isFavorite={isFavorite}
              onFavoriteChange={() => {
                setIsFavorite(!isFavorite);
                onRefreshFavorites();
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Video (si existe) */}
          {article.videoUrl && (
            <div className="mb-6">
              <Alert className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <PlayCircle className="h-4 w-4 text-indigo-600" />
                <AlertDescription className="text-indigo-900">
                  <strong>Video tutorial disponible:</strong> Este artículo incluye un video explicativo paso a paso.
                  <div className="mt-2">
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => window.open(article.videoUrl, "_blank")}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Ver video tutorial
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Contenido del artículo */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {article.content}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Feedback */}
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <p className="font-medium mb-4">¿Te resultó útil este artículo?</p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant={helpful === true ? "default" : "outline"}
                size="lg"
                onClick={() => handleFeedback(true)}
                disabled={helpful !== null}
                className={helpful === true ? "bg-success hover:bg-success/90" : ""}
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Sí, me ayudó
              </Button>
              <Button
                variant={helpful === false ? "default" : "outline"}
                size="lg"
                onClick={() => handleFeedback(false)}
                disabled={helpful !== null}
                className={helpful === false ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                No, necesito más ayuda
              </Button>
            </div>
            {helpful !== null && (
              <p className="text-sm text-muted-foreground mt-4">
                Gracias por tu feedback. Tu opinión nos ayuda a mejorar.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Artículos relacionados */}
      {relatedArticles.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Artículos relacionados</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  onClick={() => {
                    const newArticle = helpStore.getArticleById(related.id);
                    if (newArticle) {
                      // Scroll to top
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      // Update article
                      setTimeout(() => {
                        (document.querySelector('[data-article-view]') as any)?.updateArticle(newArticle);
                      }, 300);
                    }
                  }}
                  className="border border-border rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all"
                >
                  <h4 className="font-medium mb-2">{related.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {related.summary}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================
// FAQ DETAIL VIEW
// ============================================
function FAQDetailView({ faq, onBack, onRefreshFavorites }: { faq: FAQ; onBack: () => void; onRefreshFavorites: () => void }) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [isFavorite, setIsFavorite] = useState(helpStore.isFavorite(faq.id, "faq"));

  const handleFeedback = async (isHelpful: boolean) => {
    setHelpful(isHelpful);
    if (isHelpful) {
      await helpStore.markAsHelpful(faq.id, "faq");
      toast.success("¡Gracias por tu feedback!");
    } else {
      await helpStore.markAsNotHelpful(faq.id, "faq");
      toast.info("Gracias, trabajaremos en mejorar esta respuesta");
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-emerald-600 text-white p-3 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{faq.question}</CardTitle>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline">
                {helpStore.getCategories().find(c => c.value === faq.category)?.label}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {faq.popularity} vistas
              </Badge>
            </div>
            
            {/* Acciones del FAQ */}
            <div className="mt-4">
              <ArticleActions 
                article={{ id: faq.id, title: faq.question, summary: faq.answer, content: faq.answer }}
                type="faq"
                isFavorite={isFavorite}
                onFavoriteChange={() => {
                  setIsFavorite(!isFavorite);
                  onRefreshFavorites();
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Respuesta */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {faq.answer}
          </p>
        </div>

        {/* Tags */}
        {faq.tags.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Palabras clave:</p>
            <div className="flex flex-wrap gap-2">
              {faq.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Feedback */}
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="font-medium mb-4">¿Respondió tu pregunta?</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={helpful === true ? "default" : "outline"}
              size="lg"
              onClick={() => handleFeedback(true)}
              disabled={helpful !== null}
              className={helpful === true ? "bg-success hover:bg-success/90" : ""}
            >
              <ThumbsUp className="w-5 h-5 mr-2" />
              Sí
            </Button>
            <Button
              variant={helpful === false ? "default" : "outline"}
              size="lg"
              onClick={() => handleFeedback(false)}
              disabled={helpful !== null}
              className={helpful === false ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              <ThumbsDown className="w-5 h-5 mr-2" />
              No
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// CATEGORY VIEW
// ============================================
function CategoryView({ 
  category, 
  onSelectArticle,
  onSelectFAQ,
  onBack 
}: { 
  category: HelpCategory;
  onSelectArticle: (id: string) => void;
  onSelectFAQ: (id: string) => void;
  onBack: () => void;
}) {
  const categoryInfo = helpStore.getCategories().find(c => c.value === category)!;
  const articles = helpStore.getArticlesByCategory(category);
  const faqs = helpStore.getFAQsByCategory(category);

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl">{categoryInfo.label}</CardTitle>
              <CardDescription className="text-base mt-1">
                {categoryInfo.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs: Artículos y FAQs */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-white border border-border">
          <TabsTrigger value="articles" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3">
            <FileText className="w-4 h-4" />
            Artículos ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="faqs" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3">
            <HelpCircle className="w-4 h-4" />
            FAQs ({faqs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
              {articles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay artículos en esta categoría</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => onSelectArticle(article.id)}
                      className="border border-border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 group-hover:text-indigo-600 transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs">
          <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
              {faqs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay FAQs en esta categoría</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      onClick={() => onSelectFAQ(faq.id)}
                      className="border border-border rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 group-hover:text-emerald-600 transition-colors">
                            {faq.question}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {faq.answer}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// GLOSSARY VIEW
// ============================================
function GlossaryView({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const allTerms = helpStore.getGlossaryTerms();
  const filteredTerms = searchTerm 
    ? helpStore.searchGlossary(searchTerm)
    : allTerms;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="w-6 h-6" />
              Glosario de términos médicos y técnicos
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Definiciones de términos utilizados en ePrescription
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar término..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista de términos */}
        <div className="space-y-4">
          {filteredTerms.map((term) => (
            <div key={term.id} className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-lg mb-2">{term.term}</h4>
              <p className="text-sm text-muted-foreground mb-3">{term.definition}</p>
              {term.relatedTerms.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Términos relacionados:</p>
                  <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.map((related, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {related}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookMarked className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No se encontraron términos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// VIDEOS VIEW
// ============================================
interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  level: "beginner" | "intermediate" | "advanced";
  views: number;
  tags: string[];
  youtubeId?: string; // Para embeds de YouTube
}

function VideosView({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

  // Videos tutoriales del sistema
  const videos: VideoTutorial[] = [
    {
      id: "vid-001",
      title: "Introducción a ePrescription",
      description: "Conoce las funcionalidades principales del sistema, la navegación y cómo empezar a usar ePrescription.",
      duration: "5:30",
      category: "general",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
      level: "beginner",
      views: 1247,
      tags: ["Introducción", "Básico", "Tour guiado"],
      youtubeId: "dQw4w9WgXcQ" // Placeholder
    },
    {
      id: "vid-002",
      title: "Cómo crear tu primera receta médica",
      description: "Paso a paso completo para crear una prescripción: seleccionar paciente, agregar medicamentos, configurar posología y emitir la receta.",
      duration: "8:45",
      category: "prescripciones",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
      level: "beginner",
      views: 2156,
      tags: ["Recetas", "Prescripciones", "Tutorial"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-003",
      title: "Gestión de pacientes: Crear y editar perfiles",
      description: "Aprende a registrar nuevos pacientes, actualizar información médica, agregar alergias y gestionar el historial clínico.",
      duration: "6:20",
      category: "pacientes",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      level: "beginner",
      views: 987,
      tags: ["Pacientes", "Gestión", "Historial"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-004",
      title: "Firma digital y códigos QR",
      description: "Configuración de firma digital, generación de códigos QR y verificación de autenticidad de recetas.",
      duration: "7:15",
      category: "firma",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225&fit=crop",
      level: "intermediate",
      views: 756,
      tags: ["Firma digital", "QR", "Seguridad"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-005",
      title: "Dispensación de medicamentos en farmacia",
      description: "Proceso completo de verificación de recetas, escaneo de QR, registro de dispensación y gestión de rechazos.",
      duration: "9:30",
      category: "dispensacion",
      thumbnail: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=225&fit=crop",
      level: "intermediate",
      views: 1423,
      tags: ["Farmacia", "Dispensación", "Verificación"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-006",
      title: "Alertas clínicas e interacciones medicamentosas",
      description: "Cómo interpretar alertas de interacciones, alergias y contraindicaciones. Casos prácticos y mejores prácticas.",
      duration: "10:45",
      category: "alertas",
      thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
      level: "advanced",
      views: 632,
      tags: ["Alertas", "Interacciones", "Seguridad"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-007",
      title: "Gestión de inventario y stock de farmacia",
      description: "Control de stock, alertas de nivel bajo, ajustes de inventario, lotes y fechas de vencimiento.",
      duration: "8:00",
      category: "inventario",
      thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=225&fit=crop",
      level: "intermediate",
      views: 845,
      tags: ["Inventario", "Stock", "Farmacia"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-008",
      title: "Reportes y analítica avanzada",
      description: "Generación de reportes de actividad médica, farmacéutica, exportación de datos y uso de dashboards analíticos.",
      duration: "11:20",
      category: "reportes",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      level: "advanced",
      views: 567,
      tags: ["Reportes", "Analítica", "KPIs"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-009",
      title: "Gestión de usuarios y roles (Administradores)",
      description: "Crear usuarios, asignar roles, configurar permisos, sistema multi-rol y seguridad del sistema.",
      duration: "12:00",
      category: "seguridad",
      thumbnail: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=225&fit=crop",
      level: "advanced",
      views: 423,
      tags: ["Administración", "Usuarios", "Seguridad"],
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "vid-010",
      title: "Interoperabilidad: FHIR y HL7",
      description: "Exportación de recetas en formato FHIR, integración con sistemas externos y estándares de interoperabilidad.",
      duration: "13:45",
      category: "interoperabilidad",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      level: "advanced",
      views: 312,
      tags: ["FHIR", "HL7", "Integración"],
      youtubeId: "dQw4w9WgXcQ"
    }
  ];

  const categories = [
    { value: "all", label: "Todos los videos", count: videos.length },
    { value: "general", label: "General", count: videos.filter(v => v.category === "general").length },
    { value: "prescripciones", label: "Prescripciones", count: videos.filter(v => v.category === "prescripciones").length },
    { value: "pacientes", label: "Pacientes", count: videos.filter(v => v.category === "pacientes").length },
    { value: "dispensacion", label: "Dispensación", count: videos.filter(v => v.category === "dispensacion").length },
    { value: "inventario", label: "Inventario", count: videos.filter(v => v.category === "inventario").length },
    { value: "firma", label: "Firma Digital", count: videos.filter(v => v.category === "firma").length },
    { value: "alertas", label: "Alertas Clínicas", count: videos.filter(v => v.category === "alertas").length },
    { value: "reportes", label: "Reportes", count: videos.filter(v => v.category === "reportes").length },
    { value: "seguridad", label: "Seguridad", count: videos.filter(v => v.category === "seguridad").length },
    { value: "interoperabilidad", label: "Interoperabilidad", count: videos.filter(v => v.category === "interoperabilidad").length },
  ];

  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Básico</Badge>;
      case "intermediate":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Intermedio</Badge>;
      case "advanced":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Avanzado</Badge>;
    }
  };

  if (selectedVideo) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a videos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Video Player */}
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-80" />
                <p className="text-lg mb-2">Video: {selectedVideo.title}</p>
                <p className="text-sm opacity-75">Duración: {selectedVideo.duration}</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Reproducir video
                </Button>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl mb-2">{selectedVideo.title}</h2>
                <p className="text-muted-foreground mb-3">{selectedVideo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {getLevelBadge(selectedVideo.level)}
                  <Badge variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    {selectedVideo.views.toLocaleString()} vistas
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedVideo.duration}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Temas relacionados:</p>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Descargar transcripción
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Videos relacionados */}
          <div className="pt-6 border-t border-border">
            <h3 className="mb-4">Videos relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos
                .filter(v => v.category === selectedVideo.category && v.id !== selectedVideo.id)
                .slice(0, 4)
                .map(video => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="flex gap-3 p-3 border border-border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
                  >
                    <div className="relative w-32 h-18 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-white opacity-90" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {video.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-6 h-6" />
              Biblioteca de videos tutoriales
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Aprende a usar ePrescription con nuestros tutoriales en video paso a paso
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Filtro por categoría */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Filtrar por categoría:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="gap-2"
              >
                {cat.label}
                <Badge variant="secondary" className="ml-1">
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="border border-border rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="bg-blue-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="font-medium mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {getLevelBadge(video.level)}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {video.views.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay videos en esta categoría</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
