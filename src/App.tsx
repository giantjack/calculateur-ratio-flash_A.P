import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";

// Ratios courants avec descriptions
const COMMON_RATIOS = [
  { ratio: "1:4", stops: -2, desc: "Fill léger", usage: "Déboucher les ombres" },
  { ratio: "1:2", stops: -1, desc: "Fill naturel", usage: "Portrait naturel, reportage" },
  { ratio: "1:1", stops: 0, desc: "Équilibré", usage: "Flash de remplissage parfait" },
  { ratio: "2:1", stops: 1, desc: "Flash dominant", usage: "Portrait studio, sujet détaché" },
  { ratio: "4:1", stops: 2, desc: "Flash marqué", usage: "Effet dramatique, sport" },
  { ratio: "8:1", stops: 3, desc: "Flash très fort", usage: "High-speed sync, fond sombre" },
];

function App() {
  // Différence en stops entre flash et ambiance
  // Positif = flash plus fort, Négatif = ambiance plus forte
  const [flashDiff, setFlashDiff] = useState(0);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Calcul du ratio
  const calculation = useMemo(() => {
    const flashPower = Math.pow(2, flashDiff);
    const ambientPower = 1;
    const totalPower = flashPower + ambientPower;

    // Contribution en pourcentage
    const flashPercent = (flashPower / totalPower) * 100;
    const ambientPercent = (ambientPower / totalPower) * 100;

    // Ratio formaté (arrondi pour éviter les décimales longues)
    let ratioText: string;
    if (flashDiff === 0) {
      ratioText = "1:1";
    } else if (flashDiff > 0) {
      const ratio = Math.pow(2, flashDiff);
      // Arrondir à 1 décimale si nécessaire, sinon entier
      const rounded = ratio % 1 === 0 ? ratio : Math.round(ratio * 10) / 10;
      ratioText = `${rounded}:1`;
    } else {
      const ratio = Math.pow(2, -flashDiff);
      const rounded = ratio % 1 === 0 ? ratio : Math.round(ratio * 10) / 10;
      ratioText = `1:${rounded}`;
    }

    // Description de l'effet
    let effect: string;
    let description: string;
    if (flashDiff <= -2) {
      effect = "Fill très léger";
      description = "Le flash débouche à peine les ombres. L'ambiance naturelle domine complètement.";
    } else if (flashDiff === -1) {
      effect = "Fill naturel";
      description = "Le flash remplit doucement les ombres sans être visible. Idéal pour le portrait en extérieur.";
    } else if (flashDiff === 0) {
      effect = "Équilibre parfait";
      description = "Flash et ambiance contribuent à parts égales. Rendu naturel avec des ombres bien définies.";
    } else if (flashDiff === 1) {
      effect = "Flash légèrement dominant";
      description = "Le sujet se détache légèrement du fond. Look de portrait professionnel.";
    } else if (flashDiff === 2) {
      effect = "Flash dominant";
      description = "Effet dramatique, le sujet ressort nettement. Fond assombri.";
    } else {
      effect = "Flash très dominant";
      description = "Le flash contrôle presque toute l'exposition. Fond très sombre ou noir.";
    }

    return {
      flashPercent,
      ambientPercent,
      ratioText,
      effect,
      description,
      flashPower,
    };
  }, [flashDiff]);

  return (
    <Box maxW="900px" mx="auto" p={{ base: 3, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Slider principal */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium" fontSize="sm">
              Puissance du flash vs ambiance
            </Text>
            <Badge colorScheme={flashDiff > 0 ? "orange" : flashDiff < 0 ? "blue" : "green"} fontSize="md" px={3}>
              {flashDiff > 0 ? `+${flashDiff}` : flashDiff} stop{Math.abs(flashDiff) > 1 ? "s" : ""}
            </Badge>
          </Flex>
          <Box px={2}>
            <Slider
              value={flashDiff}
              onChange={setFlashDiff}
              min={-3}
              max={4}
              step={0.5}
            >
              <SliderTrack bg="gray.200" h={3} borderRadius="full">
                <SliderFilledTrack
                  bg={flashDiff > 0 ? "#FB9936" : flashDiff < 0 ? "#3182CE" : "#38A169"}
                />
              </SliderTrack>
              <SliderThumb boxSize={6} bg="white" borderWidth={2} borderColor="#212E40" />
            </Slider>
            <Flex justify="space-between" fontSize="xs" color="gray.500" mt={1}>
              <Text>Ambiance +3</Text>
              <Text>Équilibré</Text>
              <Text>Flash +4</Text>
            </Flex>
          </Box>
        </Box>

        {/* Résultat principal */}
        <Box bg="#EFF7FB" p={4} borderRadius="md">
          <VStack spacing={3}>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <VStack spacing={0}>
                <Text fontSize="sm" color="gray.500">
                  Ratio
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="#212E40">
                  {calculation.ratioText}
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontSize="sm" color="gray.500">
                  Effet
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="#FB9936">
                  {calculation.effect}
                </Text>
              </VStack>
            </HStack>
            <Text textAlign="center" fontSize="sm" color="gray.600">
              {calculation.description}
            </Text>
          </VStack>
        </Box>

        {/* Visualisation */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Répartition de la lumière
          </Text>
          <Box position="relative" h="80px" borderRadius="md" overflow="hidden">
            <Flex h="100%">
              {/* Ambiance */}
              <Flex
                w={`${calculation.ambientPercent}%`}
                bg="linear-gradient(135deg, #3182CE 0%, #63B3ED 100%)"
                align="center"
                justify="center"
                transition="width 0.3s ease"
                minW="60px"
              >
                <VStack spacing={0} color="white">
                  <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"}>
                    {Math.round(calculation.ambientPercent)}%
                  </Text>
                  <Text fontSize="xs">Ambiance</Text>
                </VStack>
              </Flex>
              {/* Flash */}
              <Flex
                w={`${calculation.flashPercent}%`}
                bg="linear-gradient(135deg, #FB9936 0%, #F6AD55 100%)"
                align="center"
                justify="center"
                transition="width 0.3s ease"
                minW="60px"
              >
                <VStack spacing={0} color="white">
                  <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"}>
                    {Math.round(calculation.flashPercent)}%
                  </Text>
                  <Text fontSize="xs">Flash</Text>
                </VStack>
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Aperçu visuel - Scène intérieure */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Aperçu : Portrait en intérieur
          </Text>
          <Box
            h="180px"
            borderRadius="md"
            overflow="hidden"
            position="relative"
            transition="all 0.3s ease"
            bg={`hsl(30, ${20 + calculation.ambientPercent * 0.3}%, ${15 + calculation.ambientPercent * 0.25}%)`}
          >
            {/* Mur du fond */}
            <Box
              position="absolute"
              inset={0}
              bg={`linear-gradient(180deg,
                hsl(30, ${15 + calculation.ambientPercent * 0.2}%, ${20 + calculation.ambientPercent * 0.3}%) 0%,
                hsl(25, ${10 + calculation.ambientPercent * 0.15}%, ${12 + calculation.ambientPercent * 0.2}%) 100%
              )`}
            />

            {/* Fenêtre avec lumière extérieure (ambiance froide du jour) */}
            <Box
              position="absolute"
              left="8%"
              top="15%"
              w="60px"
              h="80px"
              bg={`linear-gradient(180deg,
                hsl(210, 60%, ${40 + calculation.ambientPercent * 0.4}%) 0%,
                hsl(200, 50%, ${50 + calculation.ambientPercent * 0.3}%) 100%
              )`}
              borderRadius="sm"
              boxShadow={`0 0 ${30 + calculation.ambientPercent * 0.5}px hsl(210, 40%, ${50 + calculation.ambientPercent * 0.3}%)`}
              opacity={0.3 + calculation.ambientPercent * 0.007}
            />
            {/* Cadre fenêtre */}
            <Box
              position="absolute"
              left="8%"
              top="15%"
              w="60px"
              h="80px"
              border="3px solid"
              borderColor={`hsl(30, 20%, ${25 + calculation.ambientPercent * 0.15}%)`}
              borderRadius="sm"
            />

            {/* Lampe (lumière chaude tungstène ~3000K) */}
            <Box
              position="absolute"
              right="12%"
              top="10%"
              w="30px"
              h="40px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Abat-jour */}
              <Box
                w="30px"
                h="25px"
                bg={`hsl(35, ${60 + calculation.ambientPercent * 0.3}%, ${50 + calculation.ambientPercent * 0.35}%)`}
                clipPath="polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"
                boxShadow={`0 0 ${20 + calculation.ambientPercent * 0.4}px hsl(35, 80%, 50%)`}
                opacity={0.5 + calculation.ambientPercent * 0.005}
              />
              {/* Pied */}
              <Box w="4px" h="15px" bg={`hsl(30, 30%, ${30 + calculation.ambientPercent * 0.1}%)`} />
            </Box>

            {/* Halo de la lampe sur le mur */}
            <Box
              position="absolute"
              right="5%"
              top="5%"
              w="100px"
              h="100px"
              borderRadius="full"
              bg={`radial-gradient(circle, hsla(35, 70%, 50%, ${0.1 + calculation.ambientPercent * 0.003}) 0%, transparent 70%)`}
            />

            {/* Tableau/cadre sur le mur */}
            <Box
              position="absolute"
              left="38%"
              top="12%"
              w="50px"
              h="35px"
              bg={`hsl(30, 15%, ${22 + calculation.ambientPercent * 0.15}%)`}
              border="2px solid"
              borderColor={`hsl(35, 40%, ${35 + calculation.ambientPercent * 0.2}%)`}
              borderRadius="sm"
            />

            {/* Sujet (personne) */}
            <Box
              position="absolute"
              left="50%"
              bottom="0"
              transform="translateX(-50%)"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Tête - mélange couleur flash (neutre) et ambiance (chaud) */}
              <Box
                w="45px"
                h="50px"
                borderRadius="full"
                bg={`hsl(${25 + calculation.flashPercent * 0.15}, ${40 - calculation.flashPercent * 0.2}%, ${45 + (calculation.flashPercent + calculation.ambientPercent) * 0.15}%)`}
                boxShadow={flashDiff >= 0
                  ? `0 0 ${15 + calculation.flashPercent * 0.3}px hsla(45, 20%, 80%, ${0.2 + calculation.flashPercent * 0.005})`
                  : "none"
                }
                transition="all 0.3s ease"
              />
              {/* Corps */}
              <Box
                w="60px"
                h="95px"
                bg={`hsl(${220 + calculation.flashPercent * 0.1}, ${30 - calculation.flashPercent * 0.15}%, ${30 + (calculation.flashPercent + calculation.ambientPercent) * 0.12}%)`}
                borderTopRadius="md"
                mt="-5px"
                transition="all 0.3s ease"
              />
            </Box>

            {/* Effet flash (halo lumineux sur le sujet) */}
            {flashDiff > -2 && (
              <Box
                position="absolute"
                left="50%"
                bottom="20%"
                transform="translateX(-50%)"
                w={`${80 + calculation.flashPercent}px`}
                h={`${100 + calculation.flashPercent}px`}
                borderRadius="full"
                bg={`radial-gradient(circle, hsla(45, 10%, 90%, ${0.05 + calculation.flashPercent * 0.003}) 0%, transparent 60%)`}
                pointerEvents="none"
                transition="all 0.3s ease"
              />
            )}

            {/* Indicateurs */}
            <Flex
              position="absolute"
              bottom={2}
              left={0}
              right={0}
              justify="space-between"
              px={3}
              fontSize="xs"
              color="whiteAlpha.700"
            >
              <Text>Lumière jour</Text>
              <Text fontWeight="bold" color="whiteAlpha.900">
                Ambiance : ~3000K • Flash : ~5500K
              </Text>
              <Text>Lampe tungstène</Text>
            </Flex>
          </Box>
          <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
            Le flash (lumière du jour) neutralise les tons chauds de l'éclairage intérieur sur le sujet
          </Text>
        </Box>

        {/* Tableau des ratios courants */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Ratios courants
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
            {COMMON_RATIOS.map(({ ratio, stops, desc, usage }) => (
              <Box
                key={ratio}
                p={3}
                bg={flashDiff === stops ? "#FB9936" : "white"}
                color={flashDiff === stops ? "white" : "inherit"}
                borderWidth={1}
                borderColor={flashDiff === stops ? "#FB9936" : "gray.200"}
                borderRadius="md"
                cursor="pointer"
                onClick={() => setFlashDiff(stops)}
                transition="all 0.2s"
                _hover={{ borderColor: "#FB9936" }}
              >
                <Text fontWeight="bold" fontSize="lg">
                  {ratio}
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  {desc}
                </Text>
                <Text fontSize="xs" opacity={0.6}>
                  {usage}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Comment ajuster */}
        <Box bg="gray.50" p={4} borderRadius="md">
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Comment ajuster le ratio
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} fontSize="sm" color="gray.600">
            <Box>
              <Text fontWeight="semibold" color="#3182CE" mb={1}>
                Pour augmenter l'ambiance :
              </Text>
              <VStack align="start" spacing={1}>
                <Text>• Ouvrir le diaphragme</Text>
                <Text>• Ralentir la vitesse</Text>
                <Text>• Monter les ISO</Text>
                <Text>• Baisser la puissance flash</Text>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="semibold" color="#FB9936" mb={1}>
                Pour augmenter le flash :
              </Text>
              <VStack align="start" spacing={1}>
                <Text>• Augmenter la puissance flash</Text>
                <Text>• Rapprocher le flash</Text>
                <Text>• Accélérer la vitesse*</Text>
                <Text>• Fermer le diaphragme*</Text>
              </VStack>
            </Box>
          </SimpleGrid>
          <Text fontSize="xs" color="gray.500" mt={3}>
            * La vitesse et le diaphragme affectent aussi le flash. Utilisez le flash en mode manuel pour un contrôle précis.
          </Text>
        </Box>

        {/* Info pédagogique */}
        <Box bg="white" p={4} borderRadius="md" borderWidth={1} borderColor="gray.200" fontSize="sm" color="gray.600">
          <Text fontWeight="medium" mb={2}>
            Comprendre le ratio flash/ambiance
          </Text>
          <Text mb={2}>
            Le <strong>ratio flash/ambiance</strong> exprime la proportion de lumière provenant du flash
            par rapport à la lumière naturelle (ou continue).
          </Text>
          <Text mb={2}>
            <strong>Ratio 2:1</strong> signifie que le flash apporte 2× plus de lumière que l'ambiance
            (soit 1 stop de plus). <strong>Ratio 1:2</strong> signifie l'inverse.
          </Text>
          <Text>
            <strong>Astuce :</strong> Pour un portrait naturel en extérieur, commencez par exposer
            pour le fond, puis ajoutez du flash en fill (-1 à 0 stop) pour déboucher les ombres du visage.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default App;
