
"use client"
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function SpecialProductsPage() {
  const { t } = useLanguage();
  const whatsAppUrl = "https://wa.me/917022070287";

  const products = [
    {
      name: t('hairOilName'),
      description: t('hairOilDescription'),
      imageId: "hair-oil-product",
    },
    {
      name: t('painOilName'),
      description: t('painOilDescription'),
      imageId: "pain-oil-product",
    },
    {
      name: t('skinOilName'),
      description: t('skinOilDescription'),
      imageId: "skin-oil-product",
    },
    {
      name: t('sexualWellnessOilName'),
      description: t('sexualWellnessOilDescription'),
      imageId: "sexual-power-oil-product",
    },
  ];
  
  const akshayaBoxImage1 = PlaceHolderImages.find(img => img.id === 'akshaya-cash-box-1');
  const akshayaBoxImage2 = PlaceHolderImages.find(img => img.id === 'akshaya-cash-box-2');

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl border-b-2 border-primary/20 pb-4">
              {t('specialProductsTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('specialProductsSubtitle')}
            </p>
          </header>

          <Card className="mb-8 overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{t('akshayaCashBoxName')}</CardTitle>
              <CardDescription>
                {t('akshayaCashBoxDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative aspect-square w-full">
                  {akshayaBoxImage1 && <Image
                    src={akshayaBoxImage1.imageUrl}
                    alt={akshayaBoxImage1.description}
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint={akshayaBoxImage1.imageHint}
                  />}
                </div>
                <div className="relative aspect-square w-full">
                  {akshayaBoxImage2 && <Image
                    src={akshayaBoxImage2.imageUrl}
                    alt={akshayaBoxImage2.description}
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint={akshayaBoxImage2.imageHint}
                  />}
                </div>
              </div>
               <div className="text-center text-muted-foreground">
                <p>{t('akshayaCashBoxInfo')}</p>
                <p className="mt-2 font-semibold text-foreground">{t('akshayaCashBoxContact')}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-4">
               <div className="text-center">
                <p>{t('orderContact')}:</p>
                <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
              </div>
              <Button asChild>
                <Link href={whatsAppUrl} target="_blank">
                  <WhatsAppIcon />
                  {t('orderOnWhatsApp')}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-3xl text-center">{t('medicatedOilsTitle')}</CardTitle>
                  <CardDescription className="text-center">
                  {t('medicatedOilsDescription')}
                  </CardDescription>
                </CardHeader>
              </Card>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {products.map((product) => {
                const productImage = PlaceHolderImages.find(p => p.id === product.imageId);
                return (
                <Card key={product.name} className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video w-full">
                      {productImage && <Image
                        src={productImage.imageUrl}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={productImage.imageHint}
                      />}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>
              )})}
            </div>

            <Card className="mt-8">
              <CardFooter className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-4">
                 <div className="text-center">
                  <p>{t('orderAnyProduct')}:</p>
                  <p className="font-bold text-lg text-primary">7022070287, {t('hosadurga')}</p>
                </div>
                <Button asChild>
                  <Link href={whatsAppUrl} target="_blank">
                    <WhatsAppIcon />
                    {t('orderOnWhatsApp')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
