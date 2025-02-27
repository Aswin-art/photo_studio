/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Img,
  Section
} from "@react-email/components";

interface PhotoDeliveryEmailProps {
  photos: any[];
  result: string;
}

export const PhotoDeliveryEmail = ({
  photos = [],
  result = ""
}: PhotoDeliveryEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>📸 Hasil Foto Anda Telah Siap!</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Img
            src="https://res.cloudinary.com/dgluwmu1o/image/upload/v1740643440/logo_s87mcu.png"
            alt="Studio Logo"
            style={logoStyle}
          />

          <Text style={titleStyle}>📸 Hasil Foto Anda Telah Siap!</Text>

          <Text style={descriptionStyle}>
            Terima kasih telah menggunakan layanan studio foto kami! Berikut
            adalah hasil foto Anda:
          </Text>

          <Section style={resultPhotoContainerStyle}>
            {result ? (
              <a href={result} download style={{ textDecoration: "none" }}>
                <Img
                  src={result}
                  width="100%"
                  height="auto"
                  alt="Hasil Foto"
                  style={resultPhotoStyle}
                />
              </a>
            ) : (
              <Text style={emptyTextStyle}>❌ Hasil foto belum tersedia.</Text>
            )}
          </Section>

          <Text style={subTitleStyle}>📂 Semua Foto Anda</Text>
          <Section style={photoGridStyle}>
            {photos.length > 0 ? (
              photos
                .map((photo) => photo.image_url)
                .filter((url) => url)
                .map((url, index) => (
                  <div key={index} style={photoWrapperStyle}>
                    <a href={url} download style={{ textDecoration: "none" }}>
                      <Img
                        src={url}
                        width="100%"
                        height="auto"
                        alt={`Foto ${index + 1}`}
                        style={photoStyle}
                      />
                    </a>
                  </div>
                ))
            ) : (
              <Text style={emptyTextStyle}>📂 Tidak ada foto tersedia.</Text>
            )}
          </Section>

          <Text style={footerStyle}>
            📩 Jika ada pertanyaan, silakan hubungi kami. Sampai jumpa lagi! 🎉
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PhotoDeliveryEmail;

const bodyStyle = {
  backgroundColor: "#f4f4f4",
  padding: "20px"
};

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center" as const
};

const logoStyle: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  maxWidth: "150px",
  width: "100%",
  height: "auto",
  objectFit: "contain"
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  textAlign: "center" as const
};

const descriptionStyle = {
  fontSize: "16px",
  lineHeight: "1.5",
  textAlign: "center" as const
};

const resultPhotoContainerStyle = {
  marginTop: "20px",
  textAlign: "center" as const
};

const resultPhotoStyle = {
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};

const subTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginTop: "20px",
  textAlign: "center" as const
};

const photoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "12px",
  justifyContent: "center",
  marginTop: "10px"
};

const photoWrapperStyle = {
  padding: "8px",
  borderRadius: "8px"
};

const photoStyle = {
  borderRadius: "5px",
  width: "100%",
  height: "auto"
};

const emptyTextStyle = {
  fontSize: "16px",
  color: "#888",
  textAlign: "center" as const,
  marginTop: "10px"
};

const footerStyle = {
  fontSize: "14px",
  color: "#777",
  marginTop: "20px",
  textAlign: "center" as const
};
