import {StyleSheet} from "@react-pdf/renderer"

export const styles = StyleSheet.create({
    header: {
        fontSize: 12,
        fontFamily: "Times-Bold",
        textAlign: "center",
        lineHeight: 1.5
    },
    body: {
        fontSize: 12,
        fontFamily: "Times-Roman",
        lineHeight: 1.5
    },
    fontBold: {
        fontWeight: "bold",
        fontFamily: "Times-Bold",
    },
    fontNormal: {
        fontWeight: "normal",
        fontFamily: "Times-Roman",
    },
    flex: {
        display: "flex",
    },
    flexRow: {
        flexDirection: "row"
    },
    justifyBetween: {
        justifyContent: "space-between"
    },
    mt10: {
        marginTop: "10px"
    },
    mt30: {
        marginTop: "30px"
    },
    mt50: {
        marginTop: "50px"
    },
    textJustify: {
        textAlign: "justify"
    },
    textCenter: {
        textAlign: "center"
    }
})
