"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GameInstructions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Nasıl Oynanır?</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 text-gray-600 text-sm dark:text-gray-300">
				<p>
					• Verilen ipuçlarını kullanarak hem üniversite hem de program adını
					tahmin edin
				</p>
				<p>• Her tahmin sonrası hangi kısmın doğru olduğunu görebilirsiniz</p>
				<p>• Doğru tahmin ettiğiniz kısımlar yeşil renkte görünür</p>
				<p>• Her iki kısmı da doğru tahmin ettiğinizde oyunu kazanırsınız</p>
				<p>
					• İpuçları: şehir, üniversite türü, burs durumu, son 4 yılın
					sıralamaları ve bölüm türü
				</p>
			</CardContent>
		</Card>
	);
}
