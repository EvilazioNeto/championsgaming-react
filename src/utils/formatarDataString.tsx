function formatarDataString(dataString: string) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

export default formatarDataString;
