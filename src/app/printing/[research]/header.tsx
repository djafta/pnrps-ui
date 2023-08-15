import {View, Image, Text} from "@react-pdf/renderer";
import {styles} from "@/app/printing/[research]/styles";

export function Header() {

    return (
        <View style={styles.header}>
            <Image
                style={{
                    width: 80,
                    margin: "0 auto 10 auto"
                }}
                src={"/mz-republic-logo.png"}/>
            <Text>
                REPÚBLICA DE MOÇAMBIQUE
            </Text>
            <Text>
                MINISTÉRIO DA SAÚDE
            </Text>
            <Text>
                INSTITUTO NACIONAL DA SAÚDE
            </Text>
        </View>
    )
}
