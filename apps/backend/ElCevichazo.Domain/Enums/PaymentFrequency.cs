using System.Text.Json;
using System.Text.Json.Serialization;

namespace ElCevichazo.Domain.Enums;

[JsonConverter(typeof(PaymentFrequencyJsonConverter))]
public enum PaymentFrequency
{
    Weekly = 1,
    Biweekly = 2,
    Monthly = 3,
    Bimonthly = 4,
    Quarterly = 5,
    Semiannual = 6,
    Annual = 7,
    OneTime = 8
}

public class PaymentFrequencyJsonConverter : JsonConverter<PaymentFrequency>
{
    public override PaymentFrequency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var intVal = reader.GetInt32();
            if (Enum.IsDefined(typeof(PaymentFrequency), intVal))
                return (PaymentFrequency)intVal;
        }
        else if (reader.TokenType == JsonTokenType.String)
        {
            var strVal = reader.GetString()?.Trim().ToLowerInvariant();
            return strVal switch
            {
                "weekly"     or "semanal"      or "1" => PaymentFrequency.Weekly,
                "biweekly"   or "quincenal"    or "2" => PaymentFrequency.Biweekly,
                "monthly"    or "mensual"      or "3" => PaymentFrequency.Monthly,
                "bimonthly"  or "bimestral"    or "4" => PaymentFrequency.Bimonthly,
                "quarterly"  or "trimestral"   or "5" => PaymentFrequency.Quarterly,
                "semiannual" or "semestral"    or "6" => PaymentFrequency.Semiannual,
                "annual"     or "anual"        or "7" => PaymentFrequency.Annual,
                "onetime"    or "único"        or "8" => PaymentFrequency.OneTime,
                _ => throw new JsonException($"Frecuencia de pago no válida: '{strVal}'.")
            };
        }

        throw new JsonException("Tipo de dato no válido para la frecuencia de pago.");
    }

    public override void Write(Utf8JsonWriter writer, PaymentFrequency value, JsonSerializerOptions options)
    {
        var str = value switch
        {
            PaymentFrequency.Weekly     => "semanal",
            PaymentFrequency.Biweekly   => "quincenal",
            PaymentFrequency.Monthly    => "mensual",
            PaymentFrequency.Bimonthly  => "bimestral",
            PaymentFrequency.Quarterly  => "trimestral",
            PaymentFrequency.Semiannual => "semestral",
            PaymentFrequency.Annual     => "anual",
            PaymentFrequency.OneTime    => "único",
            _                           => "mensual"
        };
        writer.WriteStringValue(str);
    }
}
