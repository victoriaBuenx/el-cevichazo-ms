using System.Text.Json;
using System.Text.Json.Serialization;

namespace ElCevichazo.Domain.Enums;

[JsonConverter(typeof(PaymentMethodJsonConverter))]
public enum PaymentMethod
{
    Cash = 1,
    Transfer = 2
}

public class PaymentMethodJsonConverter : JsonConverter<PaymentMethod>
{
    public override PaymentMethod Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var intVal = reader.GetInt32();
            if (Enum.IsDefined(typeof(PaymentMethod), intVal))
            {
                return (PaymentMethod)intVal;
            }
        }
        else if (reader.TokenType == JsonTokenType.String)
        {
            var strVal = reader.GetString()?.Trim().ToLowerInvariant();
            return strVal switch
            {
                "cash" or "efectivo" or "1" => PaymentMethod.Cash,
                "transfer" or "transferencia" or "2" => PaymentMethod.Transfer,
                _ => throw new JsonException($"Método de pago no válido: '{strVal}'. Valores permitidos: efectivo (1) o transferencia (2).")
            };
        }

        throw new JsonException("Tipo de dato no válido para el método de pago.");
    }

    public override void Write(Utf8JsonWriter writer, PaymentMethod value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value == PaymentMethod.Cash ? "efectivo" : "transferencia");
    }
}
