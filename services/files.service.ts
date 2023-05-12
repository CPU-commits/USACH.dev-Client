export class FilesService {
	blobPartToUrl(part: BlobPart, type: string) {
		const blob = new Blob([part], { type })
		const url = window.URL.createObjectURL(blob)
		return url
	}

	downloadFileUrl(url: string, filename?: string) {
		const link = document.createElement('a')
		document.body.appendChild(link)
		if (filename) link.download = filename
		link.href = url
		link.click()
		document.body.removeChild(link)
	}
}
