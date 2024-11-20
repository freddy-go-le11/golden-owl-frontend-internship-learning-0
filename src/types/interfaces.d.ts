interface IDefaultLayoutProps {
  params: Promise<{
    locale: TLocale;
  }>;
  children: React.ReactNode;
}
